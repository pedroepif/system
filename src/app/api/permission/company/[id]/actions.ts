"use server";

import { env } from "process";
import {
  GetCompanyPermissionParamsType,
  GetCompanyPermissionReponseType,
} from "./types";
import { cookies } from "next/headers";

export async function getCompanyPermission(
  params: GetCompanyPermissionParamsType,
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
    `${env.BASE_URL}/api/permission/company/${id}${searchParams}`,
    {
      method: "GET",
      headers: {
        cookies: (await cookies()).toString(),
        "x-next-internal": "true",
      },
      cache: "force-cache",
      next: {
        tags: ["company-permission"],
        revalidate: 60,
      },
    },
  );
  const data: GetCompanyPermissionReponseType = await response.json();

  if (data.status !== 200) return { error: true, message: data.body.error };

  return {
    error: false,
    message: data.body.message,
    permissions: data.body.permissions,
    pageCount: data.body.pageCount,
  };
}
