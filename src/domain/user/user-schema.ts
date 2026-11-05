import { z } from "@hono/zod-openapi";

export const userSchema = z.object({
  userID: z.uuid(),
  email: z.email(),
  username: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phone: z.string().nullable(),
  jobTitle: z.string().nullable(),
  role: z.string().nullable(),
  department: z.string().nullable(),
  linuxUsername: z.string().nullable(),
  githubUsername: z.string().nullable(),
  developmentEnv: z.string().nullable(),
  otpHash: z.string().nullable(),
  passwordHash: z.string(),
  lastLogin: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const publicUserSchema = userSchema.omit({ passwordHash: true });

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

export const updateUserInputSchema = userSchema.partial().omit({
  userID: true,
  email: true,
  otpHash: true,
  passwordHash: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
});

export type User = z.infer<typeof userSchema>;
export type PublicUser = z.infer<typeof publicUserSchema>;
export type SignupInput = z.infer<typeof signupInputSchema>;
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
