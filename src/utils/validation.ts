import { z } from 'zod';

export const todoSchema = z.object({
  title: z.string().nonempty('Title is required'),
  description: z.string().nonempty('Description is required'),
  status: z.enum(['対応済み', '未対応']),
});

export const validateTodo = (todo: unknown) => {
  return todoSchema.safeParse(todo);
};
