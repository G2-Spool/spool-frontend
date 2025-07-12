const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    try {
        // Handle CORS preflight
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers,
                body: '',
            };
        }

        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ error: 'Method not allowed' }),
            };
        }

        if (!event.body) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing request body' }),
            };
        }

        const request = JSON.parse(event.body);
        
        // Basic validation
        if (!request.question || !request.studentId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields: question, studentId' }),
            };
        }

        console.log('🚀 AcademiaSearch Lambda invoked:', {
            studentId: request.studentId,
            questionLength: request.question.length,
            interestCount: request.studentProfile?.interests?.length || 0
        });

        // For now, return a basic response
        const response = {
            threadId: 'thread-' + Date.now(),
            message: 'AcademiaSearch Lambda deployed successfully! Full functionality will be available after services implementation.',
            topic: 'General Inquiry',
            category: 'Academic'
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(response),
        };

    } catch (error) {
        console.error('❌ AcademiaSearch Lambda error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            }),
        };
    }
};
