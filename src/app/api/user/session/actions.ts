"use server";
import { cookies } from "next/headers";
import {
  CreateUserSessionBodyType,
  CreateUserSessionReponseType,
} from "./types";
import { env } from "@/env";

export async function createUserSession(body: CreateUserSessionBodyType) {
  const cookieStorage = await cookies();
  const response = await fetch(`${env.BASE_URL}/api/user/session`, {
    method: "POST",
    headers: {
      cookies: cookieStorage.toString(),
      "x-next-internal": "true",
    },
    body: JSON.stringify(body),
  });
  const data: CreateUserSessionReponseType = await response.json();

  if (data.status !== 200) return { error: true, message: data.body.error };

  cookieStorage.set("session-token", data.body.token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    maxAge: (1000 * 60 * 60 * 24 * 30) / 1000,
    path: "/",
  });

  return { error: false, message: data.body.message };
}
