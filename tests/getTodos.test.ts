import { getTodos } from '../src/handlers/getTodos';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { describe, it, expect, vi } from 'vitest';

vi.mock('aws-sdk', () => {
  const mDocumentClient = {
    scan: vi.fn().mockReturnThis(),
    promise: vi.fn(),
  };
  return { DynamoDB: { DocumentClient: vi.fn(() => mDocumentClient) } };
});

describe('getTodos', () => {
  it('should return a list of todos', async () => {
    const mDocumentClient = new DynamoDB.DocumentClient();
    const todos = [
      { id: '1', title: 'Test Todo 1', description: 'Description 1', status: '未対応' },
      { id: '2', title: 'Test Todo 2', description: 'Description 2', status: '対応済み' },
    ];
    mDocumentClient.scan().promise.mockResolvedValueOnce({ Items: todos });

    const event: APIGatewayProxyEvent = {} as any;
    const context: Context = {} as any;

    const result = await getTodos(event, context);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify(todos));
  });

  it('should return an error if DynamoDB scan fails', async () => {
    const mDocumentClient = new DynamoDB.DocumentClient();
    mDocumentClient.scan().promise.mockRejectedValueOnce(new Error('DynamoDB scan failed'));

    const event: APIGatewayProxyEvent = {} as any;
    const context: Context = {} as any;

    const result = await getTodos(event, context);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(JSON.stringify({ error: 'Could not fetch todos' }));
  });
});
