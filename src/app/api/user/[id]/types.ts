import { z, ZodError } from "zod";

// Update User
export const updateUserParamsSchema = z.object({
  id: z.string(),
});
export type UpdateUserParamsType = z.infer<typeof updateUserParamsSchema>;

export const updateUserBodySchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(6).optional(),
  avatar: z.string().optional(),
});
export type UpdateUserBodyType = z.infer<typeof updateUserBodySchema>;

export const updateUserSuccessResponseSchema = z.object({
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
type UpdateUserSuccessResponseType = z.infer<
  typeof updateUserSuccessResponseSchema
>;

export const updateUserErrorResponseSchema = z.object({
  status: z.number().refine((v) => v === 400 || v === 422 || v === 500),
  body: z.object({
    error: z.string(),
    details: z.instanceof(ZodError).optional(),
  }),
});
type UpdateUserErrorResponseType = z.infer<
  typeof updateUserErrorResponseSchema
>;

export type UpdateUserReponseType =
  | UpdateUserSuccessResponseType
  | UpdateUserErrorResponseType;
