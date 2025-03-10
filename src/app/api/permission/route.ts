import { getLocaleFromRequest } from "@/lib/locale";
import { getTranslations } from "next-intl/server";
import {
  createPermissionBodySchema,
  CreatePermissionReponseType,
} from "./types";
import { ZodError } from "zod";
import { database } from "@/lib/database";

export async function POST(request: Request) {
  let response: CreatePermissionReponseType;
  const locale = getLocaleFromRequest(request);
  const t = await getTranslations({ locale, namespace: "api" });
  try {
    const body = await request.json();
    const data = createPermissionBodySchema.parse(body);
    const { email, company_id, role } = data;
    const user = await database.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      response = {
        status: 400,
        body: {
          error: t("permission.not_found", { type: "user" }),
        },
      };
      return Response.json(response, { status: 400 });
    }
    const existingPermission = await database.permission.findFirst({
      where: {
        company_id,
        user_id: user.id,
      },
    });
    if (existingPermission) {
      response = {
        status: 400,
        body: {
          error: t("permission.in_company"),
        },
      };
      return Response.json(response, { status: 400 });
    }

    const permission = await database.permission.create({
      data: {
        company_id,
        user_id: user.id,
        role,
      },
    });

    response = {
      status: 200,
      body: {
        message: t("permission.success", {
          type: "permission",
          mode: "create",
        }),
        permission,
      },
    };
    return Response.json(response, { status: 200 });
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      response = {
        status: 422,
        body: {
          error: t("permission.invalid_body"),
          details: err,
        },
      };
    }
    response = { status: 500, body: { error: t("permission.intern_error") } };
    return Response.json(response, { status: response.status });
  }
}
