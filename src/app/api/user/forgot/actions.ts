"use server";
import { cookies } from "next/headers";
import { ForgotPasswordBodyType, ForgotPasswordReponseType } from "./types";
import { env } from "@/env";

export async function forgotPassword(body: ForgotPasswordBodyType) {
  const response = await fetch(`${env.BASE_URL}/api/user/forgot`, {
    method: "POST",
    headers: {
      cookies: (await cookies()).toString(),
      "x-next-internal": "true",
    },
    body: JSON.stringify(body),
  });
  const data: ForgotPasswordReponseType = await response.json();

  if (data.status !== 200) return { error: true, message: data.body.error };

  return { error: false, message: data.body.message };
}
