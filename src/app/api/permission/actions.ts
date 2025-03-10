"use server";
import { cookies } from "next/headers";
import { CreatePermissionBodyType, CreatePermissionReponseType } from "./types";
import { env } from "@/env";
import { revalidateTag } from "next/cache";

export async function createPermission(body: CreatePermissionBodyType) {
  const response = await fetch(`${env.BASE_URL}/api/permission`, {
    method: "POST",
    headers: {
      cookies: (await cookies()).toString(),
      "x-next-internal": "true",
    },
    body: JSON.stringify(body),
  });
  const data: CreatePermissionReponseType = await response.json();

  if (data.status !== 200) return { error: true, message: data.body.error };
  revalidateTag("user-permission");
  revalidateTag("company-permission");

  return {
    error: false,
    message: data.body.message,
    permission: data.body.permission,
  };
}
