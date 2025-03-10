import { z, ZodError } from "zod";

// Create Permission
export const createPermissionBodySchema = z.object({
  email: z.string().email(),
  company_id: z.string(),
  role: z.enum(["owner", "admin", "user"]),
});
export type CreatePermissionBodyType = z.infer<
  typeof createPermissionBodySchema
>;

export const createPermissionSuccessResponseSchema = z.object({
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
type CreatePermissionSuccessResponseType = z.infer<
  typeof createPermissionSuccessResponseSchema
>;

export const createPermissionErrorResponseSchema = z.object({
  status: z.number().refine((v) => v === 400 || v === 422 || v === 500),
  body: z.object({
    error: z.string(),
    details: z.instanceof(ZodError).optional(),
  }),
});
type CreatePermissionErrorResponseType = z.infer<
  typeof createPermissionErrorResponseSchema
>;

export type CreatePermissionReponseType =
  | CreatePermissionSuccessResponseType
  | CreatePermissionErrorResponseType;
