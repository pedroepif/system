"use server";
import { cookies } from "next/headers";
import {
  InvalidateUserSessionReponseType,
  ValidateUserSessionParamsType,
  ValidateUserSessionReponseType,
} from "./types";
import { env } from "@/env";

export async function validateUserSession(
  params: ValidateUserSessionParamsType,
) {
  const { token } = params;
  const response = await fetch(`${env.BASE_URL}/api/user/session/${token}`, {
    method: "GET",
    headers: {
      cookies: (await cookies()).toString(),
      "x-next-internal": "true",
    },
    cache: "force-cache",
    next: {
      tags: ["user"],
      revalidate: 60,
    },
  });
  const data: ValidateUserSessionReponseType = await response.json();

  if (data.status !== 200) return { error: true, message: data.body.error };

  return { error: false, message: data.body.message, user: data.body.user };
}

export async function invalidateUserSession() {
  const cookieStorage = await cookies();
  const token = cookieStorage.get("session-token");
  const response = await fetch(
    `${env.BASE_URL}/api/user/session/${token?.value}`,
    {
      method: "DELETE",
      headers: {
        cookies: (await cookies()).toString(),
        "x-next-internal": "true",
      },
    },
  );
  const data: InvalidateUserSessionReponseType = await response.json();

  if (data.status !== 200) return { error: true, message: data.body.error };

  cookieStorage.delete("session-token");

  return { error: false, message: data.body.message };
}
