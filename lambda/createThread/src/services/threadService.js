const { Pool } = require('pg');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');

class ThreadService {
  constructor() {
    this.pool = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Get database connection details from SSM Parameter Store or Secrets Manager
      const connectionString = await this.getConnectionString();
      
      this.pool = new Pool({
        connectionString,
        max: 20, // Maximum number of connections in the pool
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        ssl: {
          rejectUnauthorized: false // For RDS, this is typically needed
        }
      });

      // Create threads table if it doesn't exist
      await this.ensureTableExists();
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize database connection:', error);
      throw error;
    }
  }

  async getConnectionString() {
    // Try to get from environment variable first
    if (process.env.DATABASE_URL) {
      return process.env.DATABASE_URL;
    }

    // Get individual parameters from SSM Parameter Store
    try {
      const ssmClient = new SSMClient({ region: process.env.AWS_REGION || 'us-east-1' });
      
      // Get all RDS parameters
      const parameterNames = [
        '/spool/prod/rds/host',
        '/spool/prod/rds/port',
        '/spool/prod/rds/database',
        '/spool/prod/rds/username',
        '/spool/prod/rds/password'
      ];

      const promises = parameterNames.map(name => 
        ssmClient.send(new GetParameterCommand({
          Name: name,
          WithDecryption: true
        }))
      );

      const responses = await Promise.all(promises);
      const params = {};
      
      responses.forEach((response, index) => {
        const paramName = parameterNames[index].split('/').pop();
        params[paramName] = response.Parameter.Value;
      });

      return `postgresql://${params.username}:${params.password}@${params.host}:${params.port}/${params.database}`;
    } catch (error) {
      console.error('Failed to get RDS connection from SSM:', error);
      throw new Error('Unable to retrieve database connection details');
    }
  }

  async ensureTableExists() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS threads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id VARCHAR(255) NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        interests TEXT[],
        concepts TEXT[],
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(255) NOT NULL
      );

      -- Create index for efficient queries by student
      CREATE INDEX IF NOT EXISTS idx_threads_student_id ON threads(student_id);
      CREATE INDEX IF NOT EXISTS idx_threads_created_at ON threads(created_at DESC);
    `;

    try {
      await this.pool.query(createTableQuery);
    } catch (error) {
      console.error('Error creating threads table:', error);
      throw error;
    }
  }

  async createThread(thread) {
    await this.initialize();

    const query = `
      INSERT INTO threads (
        id, student_id, title, description, interests, 
        concepts, status, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      thread.id,
      thread.studentId,
      thread.title,
      thread.description,
      thread.interests,
      thread.concepts,
      thread.status,
      thread.createdBy
    ];

    try {
      const result = await this.pool.query(query, values);
      return this.formatThread(result.rows[0]);
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Thread with this ID already exists');
      }
      throw error;
    }
  }

  async getThread(id) {
    await this.initialize();

    const query = 'SELECT * FROM threads WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    
    return result.rows.length > 0 ? this.formatThread(result.rows[0]) : null;
  }

  async listThreadsByStudent(studentId, limit = 20, offset = 0) {
    await this.initialize();

    const query = `
      SELECT * FROM threads 
      WHERE student_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;

    const countQuery = 'SELECT COUNT(*) FROM threads WHERE student_id = $1';

    try {
      const [threadsResult, countResult] = await Promise.all([
        this.pool.query(query, [studentId, limit, offset]),
        this.pool.query(countQuery, [studentId])
      ]);

      const threads = threadsResult.rows.map(row => this.formatThread(row));
      const totalCount = parseInt(countResult.rows[0].count, 10);
      const hasMore = offset + limit < totalCount;

      return {
        threads,
        totalCount,
        hasMore,
        nextOffset: hasMore ? offset + limit : null
      };
    } catch (error) {
      console.error('Error listing threads:', error);
      throw error;
    }
  }

  async updateThread(id, updates) {
    await this.initialize();

    // Build dynamic update query
    const allowedFields = ['title', 'description', 'interests', 'concepts', 'status'];
    const updateFields = [];
    const values = [];
    let valueIndex = 1;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        updateFields.push(`${key} = $${valueIndex}`);
        values.push(updates[key]);
        valueIndex++;
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    // Always update the updated_at timestamp
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    // Add the ID as the last parameter
    values.push(id);

    const query = `
      UPDATE threads 
      SET ${updateFields.join(', ')}
      WHERE id = $${valueIndex}
      RETURNING *
    `;

    try {
      const result = await this.pool.query(query, values);
      if (result.rows.length === 0) {
        return null;
      }
      return this.formatThread(result.rows[0]);
    } catch (error) {
      console.error('Error updating thread:', error);
      throw error;
    }
  }

  formatThread(row) {
    if (!row) return null;
    
    return {
      id: row.id,
      studentId: row.student_id,
      title: row.title,
      description: row.description,
      interests: row.interests || [],
      concepts: row.concepts || [],
      status: row.status,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
      createdBy: row.created_by
    };
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}

module.exports = { ThreadService };