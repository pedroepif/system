import { z, ZodError } from "zod";

// Create User
export const createUserBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string(),
  password: z.string().min(6),
});
export type CreateUserBodyType = z.infer<typeof createUserBodySchema>;

export const createUserSuccessResponseSchema = z.object({
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
type CreateUserSuccessResponseType = z.infer<
  typeof createUserSuccessResponseSchema
>;

export const createUserErrorResponseSchema = z.object({
  status: z.number().refine((v) => v === 400 || v === 422 || v === 500),
  body: z.object({
    error: z.string(),
    details: z.instanceof(ZodError).optional(),
  }),
});
type CreateUserErrorResponseType = z.infer<
  typeof createUserErrorResponseSchema
>;

export type CreateUserReponseType =
  | CreateUserSuccessResponseType
  | CreateUserErrorResponseType;
