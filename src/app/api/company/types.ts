import { z, ZodError } from "zod";

// Create Company
export const createCompanyBodySchema = z.object({
  name: z.string().min(1),
  user_id: z.string(),
  logo_white: z.string().optional(),
  logo_black: z.string().optional(),
});
export type CreateCompanyBodyType = z.infer<typeof createCompanyBodySchema>;

export const createCompanySuccessResponseSchema = z.object({
  status: z.number().refine((v) => v === 200),
  body: z.object({
    message: z.string(),
    company: z.object({
      id: z.string(),
      name: z.string(),
      logo_white: z.string().nullable(),
      logo_black: z.string().nullable(),
    }),
  }),
});
type CreateCompanySuccessResponseType = z.infer<
  typeof createCompanySuccessResponseSchema
>;

export const createCompanyErrorResponseSchema = z.object({
  status: z.number().refine((v) => v === 400 || v === 422 || v === 500),
  body: z.object({
    error: z.string(),
    details: z.instanceof(ZodError).optional(),
  }),
});
type CreateCompanyErrorResponseType = z.infer<
  typeof createCompanyErrorResponseSchema
>;

export type CreateCompanyReponseType =
  | CreateCompanySuccessResponseType
  | CreateCompanyErrorResponseType;
