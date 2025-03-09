import { getLocaleFromRequest } from "@/lib/locale";
import { getTranslations } from "next-intl/server";
import { createApiKeyBodySchema, CreateApiKeyReponseType } from "./types";
import { ZodError } from "zod";
import { database } from "@/lib/database";

export async function POST(request: Request) {
  let response: CreateApiKeyReponseType;
  const locale = getLocaleFromRequest(request);
  const t = await getTranslations({ locale, namespace: "api" });
  try {
    const body = await request.json();
    const data = createApiKeyBodySchema.parse(body);
    const apiKey = await database.apiKey.create({ data });

    response = {
      status: 200,
      body: {
        message: t("apikey.success", { type: "apikey", mode: "create" }),
        apiKey,
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
