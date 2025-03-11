import { getLocaleFromRequest } from "@/lib/locale";
import {
  DeleteApiKeyParamsType,
  DeleteApiKeyReponseType,
  GetApiKeyParamsType,
  GetApiKeyReponseType,
} from "./types";
import { getTranslations } from "next-intl/server";
import { database } from "@/lib/database";
import { ZodError } from "zod";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<DeleteApiKeyParamsType> },
) {
  let response: DeleteApiKeyReponseType;
  const locale = getLocaleFromRequest(request);
  const t = await getTranslations({ locale, namespace: "api" });
  try {
    const { id } = await params;
    const existingApiKey = await database.apiKey.findUnique({
      where: {
        id,
      },
    });
    if (!existingApiKey) {
      response = {
        status: 400,
        body: {
          error: t("apikey.not_found", { type: "apikey" }),
        },
      };
      return Response.json(response, { status: 400 });
    }

    await database.apiKey.delete({
      where: {
        id,
      },
    });

    response = {
      status: 200,
      body: {
        message: t("apikey.success", { type: "apikey", mode: "deleted" }),
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

export async function GET(
  request: Request,
  { params }: { params: Promise<GetApiKeyParamsType> },
) {
  let response: GetApiKeyReponseType;
  const locale = getLocaleFromRequest(request);
  const t = await getTranslations({ locale, namespace: "api" });
  try {
    const { id } = await params;
    const existingApiKey = await database.apiKey.findUnique({
      where: {
        id,
      },
    });
    if (!existingApiKey) {
      response = {
        status: 400,
        body: {
          error: t("apikey.not_found", { type: "apikey" }),
        },
      };
      return Response.json(response, { status: 400 });
    }

    response = {
      status: 200,
      body: {
        message: t("apikey.success", { type: "apikey", mode: "got" }),
        apiKey: existingApiKey,
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
