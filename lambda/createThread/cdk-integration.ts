// CDK Integration for CreateThread Lambda
// Add this to your existing api-gateway-stack.ts

import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';

export function addThreadEndpoints(
  api: apigateway.RestApi,
  cognitoAuthorizer: apigateway.CognitoUserPoolsAuthorizer
) {
  // Import existing Lambda function
  const threadLambda = lambda.Function.fromFunctionArn(
    this,
    'CreateThreadLambda',
    `arn:aws:lambda:${this.region}:${this.account}:function:spool-create-thread`
  );

  // Create /thread resource
  const threadResource = api.root.addResource('thread');

  // /thread/create
  const createResource = threadResource.addResource('create');
  createResource.addMethod('POST', new apigateway.LambdaIntegration(threadLambda), {
    authorizer: cognitoAuthorizer,
    authorizationType: apigateway.AuthorizationType.COGNITO,
    methodResponses: [
      {
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
        },
      },
    ],
  });

  // /thread/{id}
  const threadIdResource = threadResource.addResource('{id}');
  
  // GET /thread/{id}
  threadIdResource.addMethod('GET', new apigateway.LambdaIntegration(threadLambda), {
    authorizer: cognitoAuthorizer,
    authorizationType: apigateway.AuthorizationType.COGNITO,
    requestParameters: {
      'method.request.path.id': true,
    },
  });

  // PUT /thread/{id}
  threadIdResource.addMethod('PUT', new apigateway.LambdaIntegration(threadLambda), {
    authorizer: cognitoAuthorizer,
    authorizationType: apigateway.AuthorizationType.COGNITO,
    requestParameters: {
      'method.request.path.id': true,
    },
  });

  // /thread/list/{studentId}
  const listResource = threadResource.addResource('list');
  const studentResource = listResource.addResource('{studentId}');
  
  studentResource.addMethod('GET', new apigateway.LambdaIntegration(threadLambda), {
    authorizer: cognitoAuthorizer,
    authorizationType: apigateway.AuthorizationType.COGNITO,
    requestParameters: {
      'method.request.path.studentId': true,
      'method.request.querystring.limit': false,
      'method.request.querystring.lastEvaluatedKey': false,
    },
  });

  // Add CORS for all thread endpoints
  addCorsOptions(createResource);
  addCorsOptions(threadIdResource);
  addCorsOptions(studentResource);
}

function addCorsOptions(apiResource: apigateway.IResource) {
  apiResource.addMethod('OPTIONS', new apigateway.MockIntegration({
    integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
      },
    }],
    passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
    requestTemplates: {
      "application/json": '{"statusCode": 200}',
    },
  }), {
    methodResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Methods': true,
        'method.response.header.Access-Control-Allow-Origin': true,
      },
    }],
  });
}