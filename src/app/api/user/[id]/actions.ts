"use server";
import { cookies } from "next/headers";
import {
  UpdateUserBodyType,
  UpdateUserParamsType,
  UpdateUserReponseType,
} from "./types";
import { env } from "@/env";
import { revalidateTag } from "next/cache";

export async function updateUser(
  body: UpdateUserBodyType,
  params: UpdateUserParamsType,
) {
  const { id } = params;
  const response = await fetch(`${env.BASE_URL}/api/user/${id}`, {
    method: "PATCH",
    headers: {
      cookies: (await cookies()).toString(),
      "x-next-internal": "true",
    },
    body: JSON.stringify(body),
  });
  const data: UpdateUserReponseType = await response.json();
  revalidateTag("user");
  revalidateTag("company-permission");

  if (data.status !== 200) return { error: true, message: data.body.error };

  return { error: false, message: data.body.message, user: data.body.user };
}
