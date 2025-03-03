import { getLocaleFromRequest } from "@/lib/locale";
import {
  updateUserBodySchema,
  UpdateUserParamsType,
  UpdateUserReponseType,
} from "./types";
import { getTranslations } from "next-intl/server";
import { database } from "@/lib/database";
import { hash } from "argon2";
import { ZodError } from "zod";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<UpdateUserParamsType> },
) {
  let response: UpdateUserReponseType;
  const locale = getLocaleFromRequest(request);
  const t = await getTranslations({ locale, namespace: "api" });
  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateUserBodySchema.parse(body);
    const { email } = data;
    const existingUser = await database.user.findUnique({
      where: {
        id,
      },
    });
    if (!existingUser) {
      response = {
        status: 400,
        body: {
          error: t("user.not_found", { type: "user" }),
        },
      };
      return Response.json(response, { status: 400 });
    }
    if (data.email && data.email !== existingUser.email) {
      const emailInUse = await database.user.findUnique({
        where: {
          email,
        },
      });
      if (emailInUse) {
        response = {
          status: 400,
          body: {
            error: t("user.email_in_use"),
          },
        };
        return Response.json(response, { status: 400 });
      }
    }

    if (data.password) data.password = await hash(data.password);

    const user = await database.user.update({
      where: {
        id,
      },
      data: {
        ...existingUser,
        ...data,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
      },
    });

    response = {
      status: 200,
      body: {
        message: t("user.success", { type: "user", mode: "edit" }),
        user,
      },
    };
    return Response.json(response, { status: 200 });
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      response = {
        status: 422,
        body: {
          error: t("user.invalid_body"),
          details: err,
        },
      };
    }
    response = { status: 500, body: { error: t("user.intern_error") } };
    return Response.json(response, { status: response.status });
  }
}
