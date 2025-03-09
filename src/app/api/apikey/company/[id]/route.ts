import { getLocaleFromRequest } from "@/lib/locale";
import {
  GetCompanyApiKeyParamsType,
  GetCompanyApiKeyReponseType,
} from "./types";
import { getTranslations } from "next-intl/server";
import { database } from "@/lib/database";
import { ZodError } from "zod";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<GetCompanyApiKeyParamsType> },
) {
  let response: GetCompanyApiKeyReponseType;
  const locale = getLocaleFromRequest(request);
  const t = await getTranslations({ locale, namespace: "api" });
  try {
    const { id } = await params;

    const apiKeys = await database.apiKey.findMany({
      where: {
        company_id: id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    response = {
      status: 200,
      body: {
        message: t("apikey.success", { type: "apikey", mode: "got" }),
        apiKeys,
      },
    };
    return Response.json(response, { status: 200 });
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      response = {
        status: 422,
        body: {
          error: t("apikey.invalid_body"),
          details: err,
        },
      };
    }
    response = { status: 500, body: { error: t("apikey.intern_error") } };
    return Response.json(response, { status: response.status });
  }
}
