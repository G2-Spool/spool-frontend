const bookService = require('../services/bookService');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,OPTIONS'
};

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const pathParameters = event.pathParameters || {};
    const queryStringParameters = event.queryStringParameters || {};

    // Handle different routes
    if (pathParameters.id) {
      // GET /books/{id}
      const book = await bookService.getBookById(pathParameters.id);
      
      if (!book) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Book not found' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(book)
      };
    } else if (queryStringParameters.subject) {
      // GET /books?subject=Mathematics
      const books = await bookService.getBooksBySubject(queryStringParameters.subject);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(books)
      };
    } else {
      // GET /books - return all books
      const books = await bookService.getAllBooks();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(books)
      };
    }
  } catch (error) {
    console.error('Error in getBooks handler:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};