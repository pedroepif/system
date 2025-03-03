import { z, ZodError } from "zod";

// Forgot Password
export const forgotPasswordBodySchema = z.object({
  email: z.string().email(),
});
export type ForgotPasswordBodyType = z.infer<typeof forgotPasswordBodySchema>;

export const forgotPasswordSuccessResponseSchema = z.object({
  status: z.number().refine((v) => v === 200),
  body: z.object({
    message: z.string(),
  }),
});
type ForgotPasswordSuccessResponseType = z.infer<
  typeof forgotPasswordSuccessResponseSchema
>;

export const forgotPasswordErrorResponseSchema = z.object({
  status: z.number().refine((v) => v === 400 || v === 422 || v === 500),
  body: z.object({
    error: z.string(),
    details: z.instanceof(ZodError).optional(),
  }),
});
type ForgotPasswordErrorResponseType = z.infer<
  typeof forgotPasswordErrorResponseSchema
>;

export type ForgotPasswordReponseType =
  | ForgotPasswordSuccessResponseType
  | ForgotPasswordErrorResponseType;
