import * as cdk from 'aws-cdk-lib';
import { TodoApiStack } from './lib/todo-api-stack';

const app = new cdk.App();
new TodoApiStack(app, 'TodoApiStack');
