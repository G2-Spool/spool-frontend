const { handler: getBooksHandler } = require('./handlers/getBooks');

// Main handler that routes to appropriate handlers
exports.handler = async (event) => {
  console.log('Neo4j Books Lambda invoked with event:', JSON.stringify(event, null, 2));
  
  // Route to getBooks handler for now
  // We can add more handlers later for different operations
  return getBooksHandler(event);
};