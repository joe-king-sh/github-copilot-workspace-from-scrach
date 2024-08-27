import { deleteTodo } from '../src/handlers/deleteTodo';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { describe, it, expect, vi } from 'vitest';

vi.mock('aws-sdk', () => {
  const mDocumentClient = {
    delete: vi.fn().mockReturnThis(),
    promise: vi.fn(),
  };
  return { DynamoDB: { DocumentClient: vi.fn(() => mDocumentClient) } };
});

describe('deleteTodo', () => {
  it('should delete a todo item', async () => {
    const mDocumentClient = new DynamoDB.DocumentClient();
    mDocumentClient.delete().promise.mockResolvedValueOnce({});

    const event: APIGatewayProxyEvent = {
      pathParameters: { id: '1' },
    } as any;
    const context: Context = {} as any;

    const result = await deleteTodo(event, context);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify({ message: 'Todo deleted successfully' }));
  });

  it('should return an error if DynamoDB delete fails', async () => {
    const mDocumentClient = new DynamoDB.DocumentClient();
    mDocumentClient.delete().promise.mockRejectedValueOnce(new Error('DynamoDB delete failed'));

    const event: APIGatewayProxyEvent = {
      pathParameters: { id: '1' },
    } as any;
    const context: Context = {} as any;

    const result = await deleteTodo(event, context);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(JSON.stringify({ error: 'Could not delete todo' }));
  });
});
