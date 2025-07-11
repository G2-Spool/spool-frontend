const { Pool } = require('pg');
const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');

class LearningPathService {
  constructor() {
    this.pool = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Get database connection details from SSM Parameter Store
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

  async createLearningPath(learningPath) {
    await this.initialize();

    // Use the learning_paths table from the ERD
    const query = `
      INSERT INTO learning_paths (
        id, student_profile_id, textbook_id, subject,
        current_topic_id, current_section_id, current_concept_id,
        next_concept_id, available_concepts,
        concepts_completed, concepts_total, concepts_mastered,
        average_mastery_score, estimated_completion_date,
        daily_target_minutes, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;

    const values = [
      learningPath.id,
      learningPath.studentProfileId,
      learningPath.textbookId || null,
      learningPath.subject,
      learningPath.currentTopicId || null,
      learningPath.currentSectionId || null,
      learningPath.currentConceptId || null,
      learningPath.nextConceptId || null,
      learningPath.availableConcepts || [],
      learningPath.conceptsCompleted || 0,
      learningPath.conceptsTotal || 0,
      learningPath.conceptsMastered || 0,
      learningPath.averageMasteryScore || 0,
      learningPath.estimatedCompletionDate || null,
      learningPath.dailyTargetMinutes || 30,
      learningPath.status || 'active'
    ];

    try {
      const result = await this.pool.query(query, values);
      return this.formatLearningPath(result.rows[0]);
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Learning path for this subject already exists for the student');
      }
      throw error;
    }
  }

  async getLearningPath(id) {
    await this.initialize();

    const query = 'SELECT * FROM learning_paths WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    
    return result.rows.length > 0 ? this.formatLearningPath(result.rows[0]) : null;
  }

  async getLearningPathByStudentAndSubject(studentProfileId, subject) {
    await this.initialize();

    const query = 'SELECT * FROM learning_paths WHERE student_profile_id = $1 AND subject = $2';
    const result = await this.pool.query(query, [studentProfileId, subject]);
    
    return result.rows.length > 0 ? this.formatLearningPath(result.rows[0]) : null;
  }

  async listLearningPathsByStudent(studentProfileId, limit = 20, offset = 0) {
    await this.initialize();

    const query = `
      SELECT * FROM learning_paths 
      WHERE student_profile_id = $1 
      ORDER BY last_accessed_at DESC 
      LIMIT $2 OFFSET $3
    `;

    const countQuery = 'SELECT COUNT(*) FROM learning_paths WHERE student_profile_id = $1';

    try {
      const [pathsResult, countResult] = await Promise.all([
        this.pool.query(query, [studentProfileId, limit, offset]),
        this.pool.query(countQuery, [studentProfileId])
      ]);

      const learningPaths = pathsResult.rows.map(row => this.formatLearningPath(row));
      const totalCount = parseInt(countResult.rows[0].count, 10);
      const hasMore = offset + limit < totalCount;

      return {
        learningPaths,
        totalCount,
        hasMore,
        nextOffset: hasMore ? offset + limit : null
      };
    } catch (error) {
      console.error('Error listing learning paths:', error);
      throw error;
    }
  }

  async updateLearningPath(id, updates) {
    await this.initialize();

    // Build dynamic update query
    const allowedFields = [
      'current_topic_id', 'current_section_id', 'current_concept_id',
      'next_concept_id', 'available_concepts', 'concepts_completed',
      'concepts_total', 'concepts_mastered', 'average_mastery_score',
      'estimated_completion_date', 'daily_target_minutes', 'status'
    ];
    
    const updateFields = [];
    const values = [];
    let valueIndex = 1;

    // Convert camelCase to snake_case for database fields
    const camelToSnake = (str) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

    Object.keys(updates).forEach(key => {
      const snakeKey = camelToSnake(key);
      if (allowedFields.includes(snakeKey) && updates[key] !== undefined) {
        updateFields.push(`${snakeKey} = $${valueIndex}`);
        values.push(updates[key]);
        valueIndex++;
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    // Always update the last_accessed_at timestamp
    updateFields.push(`last_accessed_at = CURRENT_TIMESTAMP`);

    // Add the ID as the last parameter
    values.push(id);

    const query = `
      UPDATE learning_paths 
      SET ${updateFields.join(', ')}
      WHERE id = $${valueIndex}
      RETURNING *
    `;

    try {
      const result = await this.pool.query(query, values);
      if (result.rows.length === 0) {
        return null;
      }
      return this.formatLearningPath(result.rows[0]);
    } catch (error) {
      console.error('Error updating learning path:', error);
      throw error;
    }
  }

  formatLearningPath(row) {
    if (!row) return null;
    
    return {
      id: row.id,
      studentProfileId: row.student_profile_id,
      textbookId: row.textbook_id,
      subject: row.subject,
      currentTopicId: row.current_topic_id,
      currentSectionId: row.current_section_id,
      currentConceptId: row.current_concept_id,
      nextConceptId: row.next_concept_id,
      availableConcepts: row.available_concepts || [],
      conceptsCompleted: row.concepts_completed,
      conceptsTotal: row.concepts_total,
      conceptsMastered: row.concepts_mastered,
      averageMasteryScore: row.average_mastery_score,
      estimatedCompletionDate: row.estimated_completion_date,
      dailyTargetMinutes: row.daily_target_minutes,
      status: row.status,
      startedAt: row.started_at,
      lastAccessedAt: row.last_accessed_at,
      completedAt: row.completed_at
    };
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}

module.exports = { LearningPathService };