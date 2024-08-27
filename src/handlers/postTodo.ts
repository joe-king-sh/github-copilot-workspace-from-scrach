import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new DynamoDB.DocumentClient();

const todoSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(['対応済み', '未対応']),
});

export const postTodo: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const body = JSON.parse(event.body!);
    const parsedBody = todoSchema.parse(body);

    const params = {
      TableName: process.env.DYNAMODB_TABLE!,
      Item: {
        id: uuidv4(),
        ...parsedBody,
      },
    };

    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify(params.Item),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Could not create todo' }),
    };
  }
};
