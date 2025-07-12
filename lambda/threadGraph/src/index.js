const neo4j = require('neo4j-driver');
const AWS = require('aws-sdk');

const ssm = new AWS.SSM();

let driver = null;

// Initialize Neo4j driver with credentials from Parameter Store
async function initializeDriver() {
  if (driver) return driver;
  
  try {
    const params = await ssm.getParameters({
      Names: [
        '/spool/neo4j/uri',
        '/spool/neo4j/username',
        '/spool/neo4j/password'
      ],
      WithDecryption: true
    }).promise();
    
    const credentials = {};
    params.Parameters.forEach(param => {
      const key = param.Name.split('/').pop();
      credentials[key] = param.Value;
    });
    
    driver = neo4j.driver(
      credentials.uri,
      neo4j.auth.basic(credentials.username, credentials.password),
      {
        encrypted: 'ENCRYPTION_ON',
        trust: 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES',
        maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 hours
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 2 * 60 * 1000, // 2 minutes
      }
    );
    
    // Test the connection
    await driver.verifyConnectivity();
    console.log('Neo4j driver initialized successfully');
    return driver;
  } catch (error) {
    console.error('Failed to initialize Neo4j driver:', error);
    throw error;
  }
}

// CORS headers for frontend integration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Correlation-ID',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Credentials': 'true'
};

// Handle preflight OPTIONS requests
function handleCORS(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }
}

// Extract thread ID from path parameters
function extractThreadId(event) {
  const pathParameters = event.pathParameters || {};
  return pathParameters.threadId;
}

// Main Neo4j query for thread graph
async function getThreadGraph(threadId) {
  const session = driver.session({ database: 'neo4j' });
  
  try {
    // Enhanced query to get full thread path with relationships
    const query = `
      MATCH path = (s:Subject)<-[:BELONGS_TO]-(b:Book)<-[:BELONGS_TO]-(c:Chapter)<-[:BELONGS_TO]-(sec:Section)<-[:BELONGS_TO]-(ci:ChunkIndex)
      WHERE EXISTS((ci)-[:PART_OF_THREAD]->(:Thread {id: $threadId}))
      WITH path, s, b, c, sec, ci
      OPTIONAL MATCH (ci)-[:CONCEPT_RELATES_TO]->(concept:Concept)
      OPTIONAL MATCH (s)-[:BRIDGES_TO]->(otherSubject:Subject)
      RETURN {
        nodes: collect(DISTINCT {
          id: ci.id,
          type: 'ChunkIndex',
          name: ci.title,
          content: ci.content,
          subject: s.name,
          book: b.title,
          chapter: c.title,
          section: sec.title,
          relevanceScore: ci.relevance_score,
          position: ci.position
        }) + collect(DISTINCT {
          id: concept.id,
          type: 'Concept',
          name: concept.name,
          subject: concept.subject,
          difficulty: concept.difficulty
        }) + collect(DISTINCT {
          id: s.id,
          type: 'Subject',
          name: s.name,
          color: s.color_code
        }),
        edges: collect(DISTINCT {
          source: ci.id,
          target: concept.id,
          type: 'CONCEPT_RELATES_TO',
          strength: 0.8
        }) + collect(DISTINCT {
          source: s.id,
          target: otherSubject.id,
          type: 'BRIDGES_TO',
          strength: 0.9
        }),
        metadata: {
          threadId: $threadId,
          totalNodes: size(collect(DISTINCT ci)) + size(collect(DISTINCT concept)) + size(collect(DISTINCT s)),
          subjects: collect(DISTINCT s.name),
          crossSubjectBridges: collect(DISTINCT otherSubject.name)
        }
      } AS threadGraph
      LIMIT 100
    `;
    
    const result = await session.run(query, { threadId });
    
    if (result.records.length === 0) {
      return {
        nodes: [],
        edges: [],
        metadata: {
          threadId,
          totalNodes: 0,
          subjects: [],
          crossSubjectBridges: [],
          message: 'No graph data found for this thread'
        }
      };
    }
    
    return result.records[0].get('threadGraph');
  } finally {
    await session.close();
  }
}

// Test query for verification
async function testNeo4jConnection() {
  const session = driver.session({ database: 'neo4j' });
  
  try {
    const query = `
      MATCH path = (s:Subject)<-[:BELONGS_TO]-(b:Book)<-[:BELONGS_TO]-(c:Chapter)<-[:BELONGS_TO]-(sec:Section)<-[:BELONGS_TO]-(ci:ChunkIndex) 
      RETURN path LIMIT 10
    `;
    
    const result = await session.run(query);
    
    return {
      success: true,
      recordCount: result.records.length,
      sampleData: result.records.slice(0, 3).map(record => {
        const path = record.get('path');
        return {
          pathLength: path.length,
          nodes: path.segments.map(segment => ({
            start: segment.start.labels,
            end: segment.end.labels,
            relationship: segment.relationship.type
          }))
        };
      })
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  } finally {
    await session.close();
  }
}

// Main Lambda handler
exports.handler = async (event, context) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  // Handle CORS preflight
  const corsResponse = handleCORS(event);
  if (corsResponse) return corsResponse;
  
  try {
    // Initialize Neo4j connection
    await initializeDriver();
    
    const path = event.path || event.rawPath;
    const method = event.httpMethod || event.requestContext?.http?.method;
    
    // Route handling
    if (path.includes('/test') && method === 'GET') {
      // Test endpoint
      const testResult = await testNeo4jConnection();
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Neo4j connection test',
          ...testResult,
          timestamp: new Date().toISOString()
        })
      };
    }
    
    if (path.includes('/thread/') && method === 'GET') {
      // Thread graph endpoint
      const threadId = extractThreadId(event);
      
      if (!threadId) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'Thread ID is required',
            path: path
          })
        };
      }
      
      const threadGraph = await getThreadGraph(threadId);
      
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          threadId,
          graph: threadGraph,
          timestamp: new Date().toISOString()
        })
      };
    }
    
    // Default response
    return {
      statusCode: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Endpoint not found',
        availableEndpoints: [
          'GET /api/thread/{threadId}/graph',
          'GET /api/thread/test'
        ]
      })
    };
    
  } catch (error) {
    console.error('Lambda error:', error);
    
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};