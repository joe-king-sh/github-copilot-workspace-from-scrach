import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { postTodo } from '../src/handlers/postTodo';
import { DynamoDB } from 'aws-sdk';
import { TodoStatus } from '../src/models/todo';

jest.mock('aws-sdk', () => {
  const mDocumentClient = {
    put: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mDocumentClient),
    },
  };
});

describe('postTodo', () => {
  let event: APIGatewayProxyEvent;
  let context: Context;
  let callback: any;
  let dynamoDb: DynamoDB.DocumentClient;

  beforeEach(() => {
    event = {
      body: JSON.stringify({
        title: 'Test TODO',
        description: 'This is a test TODO',
        status: TodoStatus.Pending,
      }),
    } as any;
    context = {} as any;
    callback = jest.fn();
    dynamoDb = new DynamoDB.DocumentClient();
  });

  it('should create a new TODO item', async () => {
    const putSpy = jest.spyOn(dynamoDb, 'put').mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    } as any);

    const result = await postTodo(event, context, callback);

    expect(result.statusCode).toBe(201);
    const body = JSON.parse(result.body);
    expect(body.title).toBe('Test TODO');
    expect(body.description).toBe('This is a test TODO');
    expect(body.status).toBe(TodoStatus.Pending);
    expect(putSpy).toHaveBeenCalled();
  });

  it('should return 400 if validation fails', async () => {
    event.body = JSON.stringify({
      title: '',
      description: 'This is a test TODO',
      status: TodoStatus.Pending,
    });

    const result = await postTodo(event, context, callback);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.error).toBe('Could not create todo');
  });
});
