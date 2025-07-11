const { Client } = require('pg');
const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');

async function getConnectionParams() {
  const ssmClient = new SSMClient({ region: 'us-east-1' });
  
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

  return params;
}

async function checkSchema() {
  try {
    console.log('Getting RDS connection parameters from SSM...');
    const params = await getConnectionParams();
    
    const client = new Client({
      host: params.host,
      port: params.port,
      database: params.database,
      user: params.username,
      password: params.password,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log('Connecting to RDS...');
    await client.connect();
    console.log('Connected successfully!');

    // Check if learning_paths table exists
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'learning_paths'
      );
    `;
    
    const tableExists = await client.query(checkTableQuery);
    console.log('\nlearning_paths table exists:', tableExists.rows[0].exists);

    if (tableExists.rows[0].exists) {
      // Get the schema of learning_paths table
      const schemaQuery = `
        SELECT 
          column_name,
          data_type,
          character_maximum_length,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_name = 'learning_paths'
        ORDER BY ordinal_position;
      `;
      
      const schema = await client.query(schemaQuery);
      console.log('\nlearning_paths table schema:');
      console.table(schema.rows);
    }

    // List all tables
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    const tables = await client.query(tablesQuery);
    console.log('\nAll tables in database:');
    tables.rows.forEach(row => console.log('  -', row.table_name));

    await client.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkSchema();