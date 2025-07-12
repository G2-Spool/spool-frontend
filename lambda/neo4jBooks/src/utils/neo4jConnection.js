const neo4j = require('neo4j-driver');
const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');

const ssmClient = new SSMClient({ region: 'us-east-1' });

let driver = null;

async function getParameter(name) {
  try {
    const command = new GetParameterCommand({
      Name: name,
      WithDecryption: true
    });
    const response = await ssmClient.send(command);
    return response.Parameter.Value;
  } catch (error) {
    console.error(`Error getting parameter ${name}:`, error);
    throw error;
  }
}

async function getDriver() {
  if (driver) {
    return driver;
  }

  try {
    // Get Neo4j connection parameters from SSM
    const [uri, username, password] = await Promise.all([
      getParameter('/spool/prod/neo4j/uri'),
      getParameter('/spool/prod/neo4j/username'),
      getParameter('/spool/prod/neo4j/password')
    ]);

    driver = neo4j.driver(
      uri,
      neo4j.auth.basic(username, password),
      { 
        encrypted: 'ENCRYPTION_ON',
        trust: 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES'
      }
    );

    // Verify connectivity
    await driver.verifyConnectivity();
    console.log('Neo4j connection established successfully');

    return driver;
  } catch (error) {
    console.error('Error connecting to Neo4j:', error);
    throw error;
  }
}

async function closeDriver() {
  if (driver) {
    await driver.close();
    driver = null;
  }
}

module.exports = {
  getDriver,
  closeDriver
};