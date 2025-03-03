import { getLocaleFromRequest } from "@/lib/locale";
import { getTranslations } from "next-intl/server";
import { createCompanyBodySchema, CreateCompanyReponseType } from "./types";
import { ZodError } from "zod";
import { database } from "@/lib/database";

export async function POST(request: Request) {
  let response: CreateCompanyReponseType;
  const locale = getLocaleFromRequest(request);
  const t = await getTranslations({ locale, namespace: "api" });
  try {
    const body = await request.json();
    const data = createCompanyBodySchema.parse(body);
    const { user_id, ...companyInfo } = data;
    const user = await database.user.findUnique({
      where: {
        id: user_id,
      },
    });
    if (!user) {
      response = {
        status: 400,
        body: {
          error: t("company.not_found", { type: "owner" }),
        },
      };
      return Response.json(response, { status: 400 });
    }

    const company = await database.company.create({
      data: companyInfo,
    });

    await database.permission.create({
      data: {
        company_id: company.id,
        user_id,
        role: "owner",
      },
    });

    response = {
      status: 200,
      body: {
        message: t("company.success", { type: "company", mode: "create" }),
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
