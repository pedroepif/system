"use server";

import { env } from "process";
import {
  GetCompanyApiKeyParamsType,
  GetCompanyApiKeyReponseType,
} from "./types";
import { cookies } from "next/headers";

export async function getCompanyApiKey(params: GetCompanyApiKeyParamsType) {
  const { id } = params;

  const response = await fetch(`${env.BASE_URL}/api/apikey/company/${id}`, {
    method: "GET",
    headers: {
      cookies: (await cookies()).toString(),
      "x-next-internal": "true",
    },
    cache: "force-cache",
    next: {
      tags: ["company-apikey"],
      revalidate: 60,
    },
  });
  const data: GetCompanyApiKeyReponseType = await response.json();

  if (data.status !== 200) return { error: true, message: data.body.error };

  return {
    error: false,
    message: data.body.message,
    apiKeys: data.body.apiKeys,
  };
}
