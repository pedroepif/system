import { z, ZodError } from "zod";

// Company ApiKeys
export const getCompanyApiKeyParamsSchema = z.object({
  id: z.string(),
});
export type GetCompanyApiKeyParamsType = z.infer<
  typeof getCompanyApiKeyParamsSchema
>;

export const getCompanyApiKeySuccessResponseSchema = z.object({
  status: z.number().refine((v) => v === 200),
  body: z.object({
    message: z.string(),
    apiKeys: z.array(
      z.object({
        id: z.string(),
        company_id: z.string(),
        created_at: z.date(),
      }),
    ),
  }),
});
type GetCompanyApiKeySuccessResponseType = z.infer<
  typeof getCompanyApiKeySuccessResponseSchema
>;

export const getCompanyApiKeyErrorResponseSchema = z.object({
  status: z.number().refine((v) => v === 400 || v === 422 || v === 500),
  body: z.object({
    error: z.string(),
    details: z.instanceof(ZodError).optional(),
  }),
});
type GetCompanyApiKeyErrorResponseType = z.infer<
  typeof getCompanyApiKeyErrorResponseSchema
>;

export type GetCompanyApiKeyReponseType =
  | GetCompanyApiKeySuccessResponseType
  | GetCompanyApiKeyErrorResponseType;
