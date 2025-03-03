"use server";
import { cookies } from "next/headers";
import { CreateUserBodyType, CreateUserReponseType } from "./types";
import { env } from "@/env";

export async function createUser(body: CreateUserBodyType) {
  const response = await fetch(`${env.BASE_URL}/api/user`, {
    method: "POST",
    headers: {
      cookies: (await cookies()).toString(),
      "x-next-internal": "true",
    },
    body: JSON.stringify(body),
  });
  const data: CreateUserReponseType = await response.json();

  if (data.status !== 200) return { error: true, message: data.body.error };

  return { error: false, message: data.body.message, user: data.body.user };
}
