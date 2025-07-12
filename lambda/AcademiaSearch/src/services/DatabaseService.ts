import { Pool, PoolClient } from 'pg';
import { DatabaseConfig } from './ParameterStoreService';

export interface ThreadData {
  threadId: string;
  studentId: string;
  originalQuestion: string;
  academicTopics: string[];
  relevantChunks: VectorChunk[];
  studentProfile: {
    interests: Array<{
      interest: string;
      category: string;
      strength: number;
    }>;
    firstName?: string;
    grade?: string;
  };
}

export interface VectorChunk {
  id: string;
  content: string;
  metadata: {
    source?: string;
    subject?: string;
    topic?: string;
    difficulty?: string;
    [key: string]: any;
  };
  score: number;
}

export class DatabaseService {
  private pool: Pool;

  constructor(config: DatabaseConfig) {
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
      ssl: {
        rejectUnauthorized: false // AWS RDS requires SSL
      },
      max: 10, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Handle pool errors
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  async storeThreadData(data: ThreadData): Promise<void> {
    const client: PoolClient = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Insert thread record
      await client.query(`
        INSERT INTO academia_threads (
          thread_id, 
          student_id, 
          original_question, 
          student_profile,
          created_at
        ) VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (thread_id) DO UPDATE SET
          original_question = EXCLUDED.original_question,
          student_profile = EXCLUDED.student_profile,
          updated_at = NOW()
      `, [
        data.threadId,
        data.studentId,
        data.originalQuestion,
        JSON.stringify(data.studentProfile)
      ]);

      // Insert academic topics
      for (let i = 0; i < data.academicTopics.length; i++) {
        await client.query(`
          INSERT INTO academia_topics (
            thread_id,
            topic_description,
            topic_order,
            created_at
          ) VALUES ($1, $2, $3, NOW())
          ON CONFLICT (thread_id, topic_order) DO UPDATE SET
            topic_description = EXCLUDED.topic_description,
            updated_at = NOW()
        `, [
          data.threadId,
          data.academicTopics[i],
          i + 1
        ]);
      }

      // Insert relevant chunks
      for (const chunk of data.relevantChunks) {
        await client.query(`
          INSERT INTO academia_chunks (
            thread_id,
            chunk_id,
            content,
            metadata,
            relevance_score,
            created_at
          ) VALUES ($1, $2, $3, $4, $5, NOW())
          ON CONFLICT (thread_id, chunk_id) DO UPDATE SET
            content = EXCLUDED.content,
            metadata = EXCLUDED.metadata,
            relevance_score = EXCLUDED.relevance_score,
            updated_at = NOW()
        `, [
          data.threadId,
          chunk.id,
          chunk.content,
          JSON.stringify(chunk.metadata),
          chunk.score
        ]);
      }

      await client.query('COMMIT');
      console.log('✅ Thread data stored successfully in database');

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Database transaction failed:', error);
      throw new Error(`Failed to store thread data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  async getThreadData(threadId: string): Promise<ThreadData | null> {
    const client: PoolClient = await this.pool.connect();
    
    try {
      // Get thread info
      const threadResult = await client.query(`
        SELECT 
          thread_id,
          student_id,
          original_question,
          student_profile
        FROM academia_threads 
        WHERE thread_id = $1
      `, [threadId]);

      if (threadResult.rows.length === 0) {
        return null;
      }

      const thread = threadResult.rows[0];

      // Get academic topics
      const topicsResult = await client.query(`
        SELECT topic_description
        FROM academia_topics 
        WHERE thread_id = $1
        ORDER BY topic_order
      `, [threadId]);

      // Get relevant chunks
      const chunksResult = await client.query(`
        SELECT 
          chunk_id,
          content,
          metadata,
          relevance_score
        FROM academia_chunks 
        WHERE thread_id = $1
        ORDER BY relevance_score DESC
      `, [threadId]);

      const academicTopics = topicsResult.rows.map(row => row.topic_description);
      const relevantChunks = chunksResult.rows.map(row => ({
        id: row.chunk_id,
        content: row.content,
        metadata: JSON.parse(row.metadata || '{}'),
        score: row.relevance_score
      }));

      return {
        threadId: thread.thread_id,
        studentId: thread.student_id,
        originalQuestion: thread.original_question,
        academicTopics,
        relevantChunks,
        studentProfile: JSON.parse(thread.student_profile || '{}')
      };

    } catch (error) {
      console.error('❌ Failed to retrieve thread data:', error);
      throw new Error(`Failed to get thread data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  async createTablesIfNotExists(): Promise<void> {
    const client: PoolClient = await this.pool.connect();
    
    try {
      // Create academia_threads table
      await client.query(`
        CREATE TABLE IF NOT EXISTS academia_threads (
          thread_id VARCHAR(255) PRIMARY KEY,
          student_id VARCHAR(255) NOT NULL,
          original_question TEXT NOT NULL,
          student_profile JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Create academia_topics table
      await client.query(`
        CREATE TABLE IF NOT EXISTS academia_topics (
          id SERIAL PRIMARY KEY,
          thread_id VARCHAR(255) NOT NULL REFERENCES academia_threads(thread_id) ON DELETE CASCADE,
          topic_description TEXT NOT NULL,
          topic_order INTEGER NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(thread_id, topic_order)
        )
      `);

      // Create academia_chunks table
      await client.query(`
        CREATE TABLE IF NOT EXISTS academia_chunks (
          id SERIAL PRIMARY KEY,
          thread_id VARCHAR(255) NOT NULL REFERENCES academia_threads(thread_id) ON DELETE CASCADE,
          chunk_id VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          metadata JSONB,
          relevance_score FLOAT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(thread_id, chunk_id)
        )
      `);

      // Create indexes for better performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_academia_threads_student_id 
        ON academia_threads(student_id)
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_academia_topics_thread_id 
        ON academia_topics(thread_id)
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_academia_chunks_thread_id 
        ON academia_chunks(thread_id)
      `);

      console.log('✅ Database tables created/verified successfully');

    } catch (error) {
      console.error('❌ Failed to create database tables:', error);
      throw new Error(`Failed to create tables: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const client: PoolClient = await this.pool.connect();
      await client.query('SELECT 1');
      client.release();
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}