import { getLocaleFromRequest } from "@/lib/locale";
import {
  DeleteCompanyParamsType,
  DeleteCompanyReponseType,
  GetCompanyParamsType,
  GetCompanyReponseType,
  updateCompanyBodySchema,
  UpdateCompanyParamsType,
  UpdateCompanyReponseType,
} from "./types";
import { getTranslations } from "next-intl/server";
import { database } from "@/lib/database";
import { ZodError } from "zod";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<UpdateCompanyParamsType> },
) {
  let response: UpdateCompanyReponseType;
  const locale = getLocaleFromRequest(request);
  const t = await getTranslations({ locale, namespace: "api" });
  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateCompanyBodySchema.parse(body);
    const existingCompany = await database.company.findUnique({
      where: {
        id,
      },
    });
    if (!existingCompany) {
      response = {
        status: 400,
        body: {
          error: t("company.not_found", { type: "company" }),
        },
      };
      return Response.json(response, { status: 400 });
    }

    const company = await database.company.update({
      where: {
        id,
      },
      data: {
        ...existingCompany,
        ...data,
      },
    });

    response = {
      status: 200,
      body: {
        message: t("company.success", { type: "company", mode: "edit" }),
        company,
      },
    };
    return Response.json(response, { status: 200 });
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      response = {
        status: 422,
        body: {
          error: t("company.invalid_body"),
          details: err,
        },
      };
    }
    response = { status: 500, body: { error: t("company.intern_error") } };
    return Response.json(response, { status: response.status });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<DeleteCompanyParamsType> },
) {
  let response: DeleteCompanyReponseType;
  const locale = getLocaleFromRequest(request);
  const t = await getTranslations({ locale, namespace: "api" });
  try {
    const { id } = await params;
    const existingCompany = await database.company.findUnique({
      where: {
        id,
      },
    });
    if (!existingCompany) {
      response = {
        status: 400,
        body: {
          error: t("company.not_found", { type: "company" }),
        },
      };
      return Response.json(response, { status: 400 });
    }

    await database.company.delete({
      where: {
        id,
      },
    });

    response = {
      status: 200,
      body: {
        message: t("company.success", { type: "company", mode: "deleted" }),
      },
    };
    return Response.json(response, { status: 200 });
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      response = {
        status: 422,
        body: {
          error: t("company.invalid_body"),
          details: err,
        },
      };
    }
    response = { status: 500, body: { error: t("company.intern_error") } };
    return Response.json(response, { status: response.status });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<GetCompanyParamsType> },
) {
  let response: GetCompanyReponseType;
  const locale = getLocaleFromRequest(request);
  const t = await getTranslations({ locale, namespace: "api" });
  try {
    const { id } = await params;
    const existingCompany = await database.company.findUnique({
      where: {
        id,
      },
    });
    if (!existingCompany) {
      response = {
        status: 400,
        body: {
          error: t("company.not_found", { type: "company" }),
        },
      };
      return Response.json(response, { status: 400 });
    }

    response = {
      status: 200,
      body: {
        message: t("company.success", { type: "company", mode: "got" }),
        company: existingCompany,
      },
    };
    return Response.json(response, { status: 200 });
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      response = {
        status: 422,
        body: {
          error: t("company.invalid_body"),
          details: err,
        },
      };
    }
    response = { status: 500, body: { error: t("company.intern_error") } };
    return Response.json(response, { status: response.status });
  }
}
