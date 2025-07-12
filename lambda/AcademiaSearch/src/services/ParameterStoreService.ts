import AWS from 'aws-sdk';

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export class ParameterStoreService {
  private ssm: AWS.SSM;

  constructor() {
    this.ssm = new AWS.SSM({ region: 'us-east-1' });
  }

  async getParameter(name: string): Promise<string> {
    try {
      const result = await this.ssm.getParameter({
        Name: name,
        WithDecryption: true
      }).promise();

      if (!result.Parameter?.Value) {
        throw new Error(`Parameter ${name} not found or has no value`);
      }

      return result.Parameter.Value;
    } catch (error) {
      console.error(`Failed to get parameter ${name}:`, error);
      throw error;
    }
  }

  async getDatabaseConfig(): Promise<DatabaseConfig> {
    try {
      const [host, port, database, username, password] = await Promise.all([
        this.getParameter('/spool/prod/rds/host'),
        this.getParameter('/spool/prod/rds/port'),
        this.getParameter('/spool/prod/rds/database'),
        this.getParameter('/spool/prod/rds/username'),
        this.getParameter('/spool/prod/rds/password')
      ]);

      return {
        host,
        port: parseInt(port, 10),
        database,
        username,
        password
      };
    } catch (error) {
      console.error('Failed to get database configuration:', error);
      throw error;
    }
  }
}