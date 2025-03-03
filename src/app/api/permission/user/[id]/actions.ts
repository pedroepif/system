"use server";

import { env } from "process";
import {
  GetUserPermissionParamsType,
  GetUserPermissionReponseType,
} from "./types";
import { cookies } from "next/headers";

export async function getUserPermission(
  params: GetUserPermissionParamsType,
  query: {
    search?: string;
    page?: number;
    limit?: number;
  },
) {
  const { id } = params;

  const queryParams = new URLSearchParams();
  if (query.search) queryParams.append("search", query.search);
  if (query.page) queryParams.append("page", query.page.toString());
  if (query.limit) queryParams.append("limit", query.limit.toString());
  const searchParams = queryParams.toString()
    ? `?${queryParams.toString()}`
    : "";

  const response = await fetch(
    `${env.BASE_URL}/api/permission/user/${id}${searchParams}`,
    {
      method: "GET",
      headers: {
        cookies: (await cookies()).toString(),
      },
      cache: "force-cache",
      next: {
        tags: ["user-permission"],
        revalidate: 60,
      },
    },
  );
  const data: GetUserPermissionReponseType = await response.json();

  if (data.status !== 200) return { error: true, message: data.body.error };

  return {
    error: false,
    message: data.body.message,
    permissions: data.body.permissions,
    pageCount: data.body.pageCount,
  };
}
