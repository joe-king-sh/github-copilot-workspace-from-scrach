import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const deleteTodo: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const { id } = event.pathParameters!;

    const params = {
      TableName: process.env.DYNAMODB_TABLE!,
      Key: {
        id,
      },
    };

    await dynamoDb.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Todo deleted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not delete todo' }),
    };
  }
};
