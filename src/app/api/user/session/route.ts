import { getLocaleFromRequest } from "@/lib/locale";
import { getTranslations } from "next-intl/server";
import {
  createUserSessionBodySchema,
  CreateUserSessionReponseType,
} from "./types";
import { ZodError } from "zod";
import { database } from "@/lib/database";
import { verify } from "argon2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

export async function POST(request: Request) {
  let response: CreateUserSessionReponseType;
  const locale = getLocaleFromRequest(request);
  const t = await getTranslations({ locale, namespace: "api" });
  try {
    const body = await request.json();
    const data = createUserSessionBodySchema.parse(body);
    const { email, password } = data;
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
    const { password: hashedPassword, ...user } = existingUser;

    const validPassword = await verify(hashedPassword, password);
    if (!validPassword) {
      response = {
        status: 400,
        body: {
          error: t("user.invalid_password"),
        },
      };
      return Response.json(response, { status: 400 });
    }

    await database.userSession.deleteMany({
      where: {
        user_id: user.id,
      },
    });

    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    await database.userSession.create({
      data: {
        id: encodeHexLowerCase(sha256(new TextEncoder().encode(token))),
        user_id: user.id,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });

    response = {
      status: 200,
      body: {
        message: t("user.success", { type: "session", mode: "create" }),
        token,
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
