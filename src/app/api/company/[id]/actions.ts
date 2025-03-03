"use server";
import { cookies } from "next/headers";
import {
  DeleteCompanyParamsType,
  DeleteCompanyReponseType,
  GetCompanyParamsType,
  GetCompanyReponseType,
  UpdateCompanyBodyType,
  UpdateCompanyParamsType,
  UpdateCompanyReponseType,
} from "./types";
import { env } from "@/env";
import { revalidateTag } from "next/cache";

export async function updateCompany(
  body: UpdateCompanyBodyType,
  params: UpdateCompanyParamsType,
) {
  const { id } = params;
  const response = await fetch(`${env.BASE_URL}/api/company/${id}`, {
    method: "PATCH",
    headers: {
      cookies: (await cookies()).toString(),
      "x-next-internal": "true",
    },
    body: JSON.stringify(body),
  });
  const data: UpdateCompanyReponseType = await response.json();
  revalidateTag("user-permission");
  revalidateTag("company");

  if (data.status !== 200) return { error: true, message: data.body.error };

  return {
    error: false,
    message: data.body.message,
    company: data.body.company,
  };
}

export async function deleteCompany(params: DeleteCompanyParamsType) {
  const { id } = params;
  const response = await fetch(`${env.BASE_URL}/api/company/${id}`, {
    method: "DELETE",
    headers: {
      cookies: (await cookies()).toString(),
      "x-next-internal": "true",
    },
  });
  const data: DeleteCompanyReponseType = await response.json();
  revalidateTag("user-permission");
  revalidateTag("company");

  if (data.status !== 200) return { error: true, message: data.body.error };

  return {
    error: false,
    message: data.body.message,
  };
}

export async function getCompany(params: GetCompanyParamsType) {
  const { id } = params;
  const response = await fetch(`${env.BASE_URL}/api/company/${id}`, {
    method: "GET",
    headers: {
      cookies: (await cookies()).toString(),
      "x-next-internal": "true",
    },
    cache: "force-cache",
    next: {
      tags: ["company"],
      revalidate: 60,
    },
  });
  const data: GetCompanyReponseType = await response.json();

  if (data.status !== 200) return { error: true, message: data.body.error };

  return {
    error: false,
    message: data.body.message,
    company: data.body.company,
  };
}
