import { z } from "@hono/zod-openapi";

export const taskStatusSchema = z.enum(["pending", "in_progress", "completed"]);
export const taskPrioritySchema = z.enum(["low", "medium", "high", "critical"]);

export const taskSchema = z.object({
  taskID: z.uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(500),
  projectID: z.uuid(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  tags: z.array(z.string().max(50)).optional(),
  assignedTo: z.uuid().optional(),
  dueDate: z.iso.datetime().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const createTaskInputSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const updateTaskInputSchema = createTaskInputSchema.partial().extend({
  status: taskStatusSchema.optional(),
});

export type Task = z.infer<typeof taskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;
