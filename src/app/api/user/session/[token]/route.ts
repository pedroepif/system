import { getLocaleFromRequest } from "@/lib/locale";
import {
  InvalidateUserSessionParamsType,
  InvalidateUserSessionReponseType,
  ValidateUserSessionParamsType,
  ValidateUserSessionReponseType,
} from "./types";
import { getTranslations } from "next-intl/server";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { database } from "@/lib/database";
import { sha256 } from "@oslojs/crypto/sha2";
import { ZodError } from "zod";

export async function GET(
  request: Request,
  { params }: { params: Promise<ValidateUserSessionParamsType> },
) {
  let response: ValidateUserSessionReponseType;
  const locale = getLocaleFromRequest(request);
  const t = await getTranslations({ locale, namespace: "api" });
  try {
    const { token } = await params;
    const id = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const userSession = await database.userSession.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
      },
    });
    if (!userSession) {
      response = {
        status: 400,
        body: {
          error: t("user.not_found", { type: "session" }),
        },
      };
      return Response.json(response, { status: 400 });
    }
    if (userSession.expires_at.getTime() < Date.now()) {
      response = {
        status: 400,
        body: {
          error: t("user.session_expired"),
        },
      };
      return Response.json(response, { status: 400 });
    }

    response = {
      status: 200,
      body: {
        message: t("user.success", { type: "session", mode: "got" }),
        user: userSession.user,
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<InvalidateUserSessionParamsType> },
) {
  let response: InvalidateUserSessionReponseType;
  const locale = getLocaleFromRequest(request);
  const t = await getTranslations({ locale, namespace: "api" });
  try {
    const { token } = await params;
    const id = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const userSession = await database.userSession.findUnique({
      where: {
        id,
      },
    });
    if (!userSession) {
      response = {
        status: 400,
        body: {
          error: t("user.not_found", { type: "session" }),
        },
      };
      return Response.json(response, { status: 400 });
    }
    await database.userSession.delete({
      where: {
        id,
      },
    });

    response = {
      status: 200,
      body: {
        message: t("user.success", { type: "session", mode: "deleted" }),
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
