import { getLocaleFromRequest } from "@/lib/locale";
import { getTranslations } from "next-intl/server";
import { forgotPasswordBodySchema, ForgotPasswordReponseType } from "./types";
import { ZodError } from "zod";
import { database } from "@/lib/database";
import { env } from "@/env";
import { signJwt } from "@/lib/jwt";
import { sendMail } from "@/lib/mail";

export async function POST(request: Request) {
  let response: ForgotPasswordReponseType;
  const locale = getLocaleFromRequest(request);
  const t = await getTranslations({ locale, namespace: "api" });
  try {
    const body = await request.json();
    const data = forgotPasswordBodySchema.parse(body);
    const { email } = data;
    const existingUser = await database.user.findUnique({
      where: {
        email,
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

    const payload = { id: existingUser.id };
    const token = await signJwt(payload);
    const html = `
      <p>You request a password recovery</p>
      <p>Click the link to reset your password:</p>
      <a href="${env.BASE_URL}/reset-password?token=${token}">Reset Password</a>
    `;

    await sendMail(email, "Password Recovery", html);

    response = {
      status: 200,
      body: {
        message: t("user.success", { type: "forgot", mode: "sent" }),
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
