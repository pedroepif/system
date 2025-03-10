import { getLocaleFromRequest } from "@/lib/locale";
import {
  DeletePermissionParamsType,
  DeletePermissionReponseType,
  updatePermissionBodySchema,
  UpdatePermissionParamsType,
  UpdatePermissionReponseType,
} from "./types";
import { getTranslations } from "next-intl/server";
import { database } from "@/lib/database";
import { ZodError } from "zod";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<UpdatePermissionParamsType> },
) {
  let response: UpdatePermissionReponseType;
  const locale = getLocaleFromRequest(request);
  const t = await getTranslations({ locale, namespace: "api" });
  try {
    const { id } = await params;
    const body = await request.json();
    const data = updatePermissionBodySchema.parse(body);
    const existingPermission = await database.permission.findUnique({
      where: {
        id,
      },
    });
    if (!existingPermission) {
      response = {
        status: 400,
        body: {
          error: t("permission.not_found", { type: "permission" }),
        },
      };
      return Response.json(response, { status: 400 });
    }

    const permission = await database.permission.update({
      where: {
        id,
      },
      data: {
        ...existingPermission,
        ...data,
      },
    });

    response = {
      status: 200,
      body: {
        message: t("permission.success", { type: "permission", mode: "edit" }),
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<DeletePermissionParamsType> },
) {
  let response: DeletePermissionReponseType;
  const locale = getLocaleFromRequest(request);
  const t = await getTranslations({ locale, namespace: "api" });
  try {
    const { id } = await params;
    const existingPermission = await database.permission.findUnique({
      where: {
        id,
      },
    });
    if (!existingPermission) {
      response = {
        status: 400,
        body: {
          error: t("permission.not_found", { type: "permission" }),
        },
      };
      return Response.json(response, { status: 400 });
    }

    await database.permission.delete({
      where: {
        id,
      },
    });

    response = {
      status: 200,
      body: {
        message: t("permission.success", {
          type: "permission",
          mode: "deleted",
        }),
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
