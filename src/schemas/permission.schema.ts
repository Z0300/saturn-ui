import z from "zod";

export const PermissionSchema = z.object({
  name: z.string().max(150, 'Permission name must be at most 50 characters long')
    .nonempty('Permission name is required')
    .regex(/^[a-z][a-z0-9_]*:[a-z][a-z0-9_]*$/,
      "Permission name must follow pattern: resource:action (e.g. users:read)"),
  description: z.string().max(500, 'Permission description must be at most 500 characters long'),
})

export type PermissionInput = z.infer<typeof PermissionSchema>