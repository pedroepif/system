import { z, ZodError } from "zod";

// Company Permissions
export const getCompanyPermissionParamsSchema = z.object({
  id: z.string(),
});
export type GetCompanyPermissionParamsType = z.infer<
  typeof getCompanyPermissionParamsSchema
>;

export const getCompanyPermissionSuccessResponseSchema = z.object({
  status: z.number().refine((v) => v === 200),
  body: z.object({
    message: z.string(),
    permissions: z.array(
      z.object({
        id: z.string(),
        company_id: z.string(),
        user_id: z.string(),
        role: z.enum(["owner", "admin", "user"]),
        user: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string().email(),
          avatar: z.string().nullable(),
        }),
      }),
    ),
    pageCount: z.number(),
  }),
});
type GetCompanyPermissionSuccessResponseType = z.infer<
  typeof getCompanyPermissionSuccessResponseSchema
>;

export const getCompanyPermissionErrorResponseSchema = z.object({
  status: z.number().refine((v) => v === 400 || v === 422 || v === 500),
  body: z.object({
    error: z.string(),
    details: z.instanceof(ZodError).optional(),
  }),
});
type GetCompanyPermissionErrorResponseType = z.infer<
  typeof getCompanyPermissionErrorResponseSchema
>;

export type GetCompanyPermissionReponseType =
  | GetCompanyPermissionSuccessResponseType
  | GetCompanyPermissionErrorResponseType;
