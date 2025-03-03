import { z, ZodError } from "zod";

// Validate UserSession
export const validateUserSessionParamsSchema = z.object({
  token: z.string(),
});
export type ValidateUserSessionParamsType = z.infer<
  typeof validateUserSessionParamsSchema
>;

export const validateUserSessionSuccessResponseSchema = z.object({
  status: z.number().refine((v) => v === 200),
  body: z.object({
    message: z.string(),
    user: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      avatar: z.string().nullable(),
    }),
  }),
});
type ValidateUserSessionSuccessResponseType = z.infer<
  typeof validateUserSessionSuccessResponseSchema
>;

export const validateUserSessionErrorResponseSchema = z.object({
  status: z.number().refine((v) => v === 400 || v === 422 || v === 500),
  body: z.object({
    error: z.string(),
    details: z.instanceof(ZodError).optional(),
  }),
});
type ValidateUserSessionErrorResponseType = z.infer<
  typeof validateUserSessionErrorResponseSchema
>;

export type ValidateUserSessionReponseType =
  | ValidateUserSessionSuccessResponseType
  | ValidateUserSessionErrorResponseType;

// Invalidate UserSession
export const invalidateUserSessionParamsSchema = z.object({
  token: z.string(),
});
export type InvalidateUserSessionParamsType = z.infer<
  typeof invalidateUserSessionParamsSchema
>;

export const invalidateUserSessionSuccessResponseSchema = z.object({
  status: z.number().refine((v) => v === 200),
  body: z.object({
    message: z.string(),
  }),
});
type InvalidateUserSessionSuccessResponseType = z.infer<
  typeof invalidateUserSessionSuccessResponseSchema
>;

export const invalidateUserSessionErrorResponseSchema = z.object({
  status: z.number().refine((v) => v === 400 || v === 422 || v === 500),
  body: z.object({
    error: z.string(),
    details: z.instanceof(ZodError).optional(),
  }),
});
type InvalidateUserSessionErrorResponseType = z.infer<
  typeof invalidateUserSessionErrorResponseSchema
>;

export type InvalidateUserSessionReponseType =
  | InvalidateUserSessionSuccessResponseType
  | InvalidateUserSessionErrorResponseType;
