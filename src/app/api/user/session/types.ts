import { z, ZodError } from "zod";

// Create UserSession
export const createUserSessionBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type CreateUserSessionBodyType = z.infer<
  typeof createUserSessionBodySchema
>;

export const createUserSessionSuccessResponseSchema = z.object({
  status: z.number().refine((v) => v === 200),
  body: z.object({
    message: z.string(),
    token: z.string(),
  }),
});
type CreateUserSessionSuccessResponseType = z.infer<
  typeof createUserSessionSuccessResponseSchema
>;

export const createUserSessionErrorResponseSchema = z.object({
  status: z.number().refine((v) => v === 400 || v === 422 || v === 500),
  body: z.object({
    error: z.string(),
    details: z.instanceof(ZodError).optional(),
  }),
});
type CreateUserSessionErrorResponseType = z.infer<
  typeof createUserSessionErrorResponseSchema
>;

export type CreateUserSessionReponseType =
  | CreateUserSessionSuccessResponseType
  | CreateUserSessionErrorResponseType;
