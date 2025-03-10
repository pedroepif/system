import { z, ZodError } from "zod";

// Update Permission
export const updatePermissionParamsSchema = z.object({
  id: z.string(),
});
export type UpdatePermissionParamsType = z.infer<
  typeof updatePermissionParamsSchema
>;

export const updatePermissionBodySchema = z.object({
  role: z.enum(["owner", "admin", "user"]).optional(),
});
export type UpdatePermissionBodyType = z.infer<
  typeof updatePermissionBodySchema
>;

export const updatePermissionSuccessResponseSchema = z.object({
  status: z.number().refine((v) => v === 200),
  body: z.object({
    message: z.string(),
    permission: z.object({
      id: z.string(),
      company_id: z.string(),
      user_id: z.string(),
      role: z.enum(["owner", "admin", "user"]),
    }),
  }),
});
type UpdatePermissionSuccessResponseType = z.infer<
  typeof updatePermissionSuccessResponseSchema
>;

export const updatePermissionErrorResponseSchema = z.object({
  status: z.number().refine((v) => v === 400 || v === 422 || v === 500),
  body: z.object({
    error: z.string(),
    details: z.instanceof(ZodError).optional(),
  }),
});
type UpdatePermissionErrorResponseType = z.infer<
  typeof updatePermissionErrorResponseSchema
>;

export type UpdatePermissionReponseType =
  | UpdatePermissionSuccessResponseType
  | UpdatePermissionErrorResponseType;

// Delete Permission
export const deletePermissionParamsSchema = z.object({
  id: z.string(),
});
export type DeletePermissionParamsType = z.infer<
  typeof deletePermissionParamsSchema
>;

export const deletePermissionSuccessResponseSchema = z.object({
  status: z.number().refine((v) => v === 200),
  body: z.object({
    message: z.string(),
  }),
});
type DeletePermissionSuccessResponseType = z.infer<
  typeof deletePermissionSuccessResponseSchema
>;

export const deletePermissionErrorResponseSchema = z.object({
  status: z.number().refine((v) => v === 400 || v === 422 || v === 500),
  body: z.object({
    error: z.string(),
    details: z.instanceof(ZodError).optional(),
  }),
});
type DeletePermissionErrorResponseType = z.infer<
  typeof deletePermissionErrorResponseSchema
>;

export type DeletePermissionReponseType =
  | DeletePermissionSuccessResponseType
  | DeletePermissionErrorResponseType;
