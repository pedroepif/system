import { z, ZodError } from "zod";

// Create ApiKey
export const createApiKeyBodySchema = z.object({
  company_id: z.string().min(1),
});
export type CreateApiKeyBodyType = z.infer<typeof createApiKeyBodySchema>;

export const createApiKeySuccessResponseSchema = z.object({
  status: z.number().refine((v) => v === 200),
  body: z.object({
    message: z.string(),
    apiKey: z.object({
      id: z.string(),
    }),
  }),
});
type CreateApiKeySuccessResponseType = z.infer<
  typeof createApiKeySuccessResponseSchema
>;

export const createApiKeyErrorResponseSchema = z.object({
  status: z.number().refine((v) => v === 400 || v === 422 || v === 500),
  body: z.object({
    error: z.string(),
    details: z.instanceof(ZodError).optional(),
  }),
});
type CreateApiKeyErrorResponseType = z.infer<
  typeof createApiKeyErrorResponseSchema
>;

export type CreateApiKeyReponseType =
  | CreateApiKeySuccessResponseType
  | CreateApiKeyErrorResponseType;
