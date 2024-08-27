import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class TodoApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table
    const table = new dynamodb.Table(this, 'TodosTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    // Lambda functions
    const getTodosLambda = new lambda.Function(this, 'GetTodosFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('src/handlers'),
      handler: 'getTodos.getTodos',
      environment: {
        DYNAMODB_TABLE: table.tableName,
      },
    });

    const postTodoLambda = new lambda.Function(this, 'PostTodoFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('src/handlers'),
      handler: 'postTodo.postTodo',
      environment: {
        DYNAMODB_TABLE: table.tableName,
      },
    });

    const deleteTodoLambda = new lambda.Function(this, 'DeleteTodoFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('src/handlers'),
      handler: 'deleteTodo.deleteTodo',
      environment: {
        DYNAMODB_TABLE: table.tableName,
      },
    });

    // Grant the Lambda functions read/write permissions to the DynamoDB table
    table.grantReadWriteData(getTodosLambda);
    table.grantReadWriteData(postTodoLambda);
    table.grantReadWriteData(deleteTodoLambda);

    // API Gateway
    const api = new apigateway.RestApi(this, 'todosApi', {
      restApiName: 'Todos Service',
      description: 'This service serves todos.',
    });

    const todos = api.root.addResource('todos');
    const singleTodo = todos.addResource('{id}');

    const getTodosIntegration = new apigateway.LambdaIntegration(getTodosLambda);
    const postTodoIntegration = new apigateway.LambdaIntegration(postTodoLambda);
    const deleteTodoIntegration = new apigateway.LambdaIntegration(deleteTodoLambda);

    todos.addMethod('GET', getTodosIntegration);
    todos.addMethod('POST', postTodoIntegration);
    singleTodo.addMethod('DELETE', deleteTodoIntegration);
  }
}
