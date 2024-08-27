export interface Todo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
}

export enum TodoStatus {
  Done = '対応済み',
  Pending = '未対応',
}
