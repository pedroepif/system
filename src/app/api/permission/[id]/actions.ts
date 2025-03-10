"use server";
import { cookies } from "next/headers";
import {
  DeletePermissionParamsType,
  DeletePermissionReponseType,
  UpdatePermissionBodyType,
  UpdatePermissionParamsType,
  UpdatePermissionReponseType,
} from "./types";
import { env } from "@/env";
import { revalidateTag } from "next/cache";

export async function updatePermission(
  body: UpdatePermissionBodyType,
  params: UpdatePermissionParamsType,
) {
  const { id } = params;
  const response = await fetch(`${env.BASE_URL}/api/permission/${id}`, {
    method: "PATCH",
    headers: {
      cookies: (await cookies()).toString(),
      "x-next-internal": "true",
    },
    body: JSON.stringify(body),
  });
  const data: UpdatePermissionReponseType = await response.json();
  revalidateTag("user-permission");
  revalidateTag("company-permission");

  if (data.status !== 200) return { error: true, message: data.body.error };

  return {
    error: false,
    message: data.body.message,
    permission: data.body.permission,
  };
}

export async function deletePermission(params: DeletePermissionParamsType) {
  const { id } = params;
  const response = await fetch(`${env.BASE_URL}/api/permission/${id}`, {
    method: "DELETE",
    headers: {
      cookies: (await cookies()).toString(),
      "x-next-internal": "true",
    },
  });
  const data: DeletePermissionReponseType = await response.json();
  revalidateTag("user-permission");
  revalidateTag("company-permission");

  if (data.status !== 200) return { error: true, message: data.body.error };

  return {
    error: false,
    message: data.body.message,
  };
}
