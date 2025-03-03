import { getLocaleFromRequest } from "@/lib/locale";
import { getTranslations } from "next-intl/server";
import { createUserBodySchema, CreateUserReponseType } from "./types";
import { ZodError } from "zod";
import { database } from "@/lib/database";
import { hash } from "argon2";

export async function POST(request: Request) {
  let response: CreateUserReponseType;
  const locale = getLocaleFromRequest(request);
  const t = await getTranslations({ locale, namespace: "api" });
  try {
    const body = await request.json();
    const data = createUserBodySchema.parse(body);
    const { email, password } = data;

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

    data.password = await hash(password);

    const user = await database.user.create({
      data,
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
        message: t("user.success", { type: "user", mode: "create" }),
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
