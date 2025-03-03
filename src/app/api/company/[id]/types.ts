import { z, ZodError } from "zod";

// Update Company
export const updateCompanyParamsSchema = z.object({
  id: z.string(),
});
export type UpdateCompanyParamsType = z.infer<typeof updateCompanyParamsSchema>;

export const updateCompanyBodySchema = z.object({
  name: z.string().min(1).optional(),
  logo_white: z.string().optional(),
  logo_black: z.string().optional(),
});
export type UpdateCompanyBodyType = z.infer<typeof updateCompanyBodySchema>;

export const updateCompanySuccessResponseSchema = z.object({
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
type UpdateCompanySuccessResponseType = z.infer<
  typeof updateCompanySuccessResponseSchema
>;

export const updateCompanyErrorResponseSchema = z.object({
  status: z.number().refine((v) => v === 400 || v === 422 || v === 500),
  body: z.object({
    error: z.string(),
    details: z.instanceof(ZodError).optional(),
  }),
});
type UpdateCompanyErrorResponseType = z.infer<
  typeof updateCompanyErrorResponseSchema
>;

export type UpdateCompanyReponseType =
  | UpdateCompanySuccessResponseType
  | UpdateCompanyErrorResponseType;

// Delete Company
export const deleteCompanyParamsSchema = z.object({
  id: z.string(),
});
export type DeleteCompanyParamsType = z.infer<typeof deleteCompanyParamsSchema>;

export const deleteCompanySuccessResponseSchema = z.object({
  status: z.number().refine((v) => v === 200),
  body: z.object({
    message: z.string(),
  }),
});
type DeleteCompanySuccessResponseType = z.infer<
  typeof deleteCompanySuccessResponseSchema
>;

export const deleteCompanyErrorResponseSchema = z.object({
  status: z.number().refine((v) => v === 400 || v === 422 || v === 500),
  body: z.object({
    error: z.string(),
    details: z.instanceof(ZodError).optional(),
  }),
});
type DeleteCompanyErrorResponseType = z.infer<
  typeof deleteCompanyErrorResponseSchema
>;

export type DeleteCompanyReponseType =
  | DeleteCompanySuccessResponseType
  | DeleteCompanyErrorResponseType;

// Get Company
export const getCompanyParamsSchema = z.object({
  id: z.string(),
});
export type GetCompanyParamsType = z.infer<typeof getCompanyParamsSchema>;

export const getCompanySuccessResponseSchema = z.object({
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
type GetCompanySuccessResponseType = z.infer<
  typeof getCompanySuccessResponseSchema
>;

export const getCompanyErrorResponseSchema = z.object({
  status: z.number().refine((v) => v === 400 || v === 422 || v === 500),
  body: z.object({
    error: z.string(),
    details: z.instanceof(ZodError).optional(),
  }),
});
type GetCompanyErrorResponseType = z.infer<
  typeof getCompanyErrorResponseSchema
>;

export type GetCompanyReponseType =
  | GetCompanySuccessResponseType
  | GetCompanyErrorResponseType;
