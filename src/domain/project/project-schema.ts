import { z } from "@hono/zod-openapi";

export const projectStatusSchema = z.enum(["active", "inactive", "archived"]);
export const projectVisibilitySchema = z.enum(["public", "private"]);

export const projectSchema = z.object({
  projectID: z.uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  userID: z.uuid(),
  status: projectStatusSchema,
  visibility: projectVisibilitySchema,
  tags: z.array(z.string().max(50)).optional(),
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime().optional(),
  localRepository: z.string().max(200).optional(),
  remoteRepository: z.string().max(200).optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const createProjectSchema = projectSchema.omit({
  projectID: true,
  status: true,
  userID: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProjectSchema = createProjectSchema.partial();

export type Project = z.infer<typeof projectSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
