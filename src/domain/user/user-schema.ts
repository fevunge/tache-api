import { z } from "@hono/zod-openapi";

export const signupInputSchema = z.object({
  username: z.string().trim().min(1),
  email: z.email(),
  password: z.string().min(1),
  phone: z.string().trim().min(1).optional(),
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  role: z.string().trim().min(1).optional(),
  department: z.string().trim().min(1).optional(),
  linuxUsername: z.string().trim().min(1).optional(),
  githubUsername: z.string().trim().min(1).optional(),
});

export const userSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  email: z.email(),
  phone: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  role: z.string().nullable(),
  department: z.string().nullable(),
  linuxUsername: z.string().nullable(),
  githubUsername: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type SignupInput = z.infer<typeof signupInputSchema>;
export type User = z.infer<typeof userSchema>;
