import { z, ZodError } from "zod";

// Delete ApiKey
export const deleteApiKeyParamsSchema = z.object({
  id: z.string(),
});
export type DeleteApiKeyParamsType = z.infer<typeof deleteApiKeyParamsSchema>;

export const deleteApiKeySuccessResponseSchema = z.object({
  status: z.number().refine((v) => v === 200),
  body: z.object({
    message: z.string(),
  }),
});
type DeleteApiKeySuccessResponseType = z.infer<
  typeof deleteApiKeySuccessResponseSchema
>;

export const deleteApiKeyErrorResponseSchema = z.object({
  status: z.number().refine((v) => v === 400 || v === 422 || v === 500),
  body: z.object({
    error: z.string(),
    details: z.instanceof(ZodError).optional(),
  }),
});
type DeleteApiKeyErrorResponseType = z.infer<
  typeof deleteApiKeyErrorResponseSchema
>;

export type DeleteApiKeyReponseType =
  | DeleteApiKeySuccessResponseType
  | DeleteApiKeyErrorResponseType;

// Get ApiKey
export const getApiKeyParamsSchema = z.object({
  id: z.string(),
});
export type GetApiKeyParamsType = z.infer<typeof getApiKeyParamsSchema>;

export const getApiKeySuccessResponseSchema = z.object({
  status: z.number().refine((v) => v === 200),
  body: z.object({
    message: z.string(),
    apiKey: z.object({
      id: z.string(),
      company_id: z.string(),
    }),
  }),
});
type GetApiKeySuccessResponseType = z.infer<
  typeof getApiKeySuccessResponseSchema
>;

export const getApiKeyErrorResponseSchema = z.object({
  status: z.number().refine((v) => v === 400 || v === 422 || v === 500),
  body: z.object({
    error: z.string(),
    details: z.instanceof(ZodError).optional(),
  }),
});
type GetApiKeyErrorResponseType = z.infer<typeof getApiKeyErrorResponseSchema>;

export type GetApiKeyReponseType =
  | GetApiKeySuccessResponseType
  | GetApiKeyErrorResponseType;
