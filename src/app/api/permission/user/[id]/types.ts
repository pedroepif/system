import { z, ZodError } from "zod";

// User Permissions
export const getUserPermissionParamsSchema = z.object({
  id: z.string(),
});
export type GetUserPermissionParamsType = z.infer<
  typeof getUserPermissionParamsSchema
>;

export const getUserPermissionSuccessResponseSchema = z.object({
  status: z.number().refine((v) => v === 200),
  body: z.object({
    message: z.string(),
    permissions: z.array(
      z.object({
        id: z.string(),
        company_id: z.string(),
        user_id: z.string(),
        role: z.enum(["owner", "admin", "user"]),
        company: z.object({
          id: z.string(),
          name: z.string(),
          logo: z.string().nullable(),
          updated_at: z.date(),
        }),
      }),
    ),
    pageCount: z.number(),
  }),
});
type GetUserPermissionSuccessResponseType = z.infer<
  typeof getUserPermissionSuccessResponseSchema
>;

export const getUserPermissionErrorResponseSchema = z.object({
  status: z.number().refine((v) => v === 400 || v === 422 || v === 500),
  body: z.object({
    error: z.string(),
    details: z.instanceof(ZodError).optional(),
  }),
});
type GetUserPermissionErrorResponseType = z.infer<
  typeof getUserPermissionErrorResponseSchema
>;

export type GetUserPermissionReponseType =
  | GetUserPermissionSuccessResponseType
  | GetUserPermissionErrorResponseType;
