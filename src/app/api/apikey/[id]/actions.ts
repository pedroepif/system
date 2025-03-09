"use server";
import { cookies } from "next/headers";
import {
  DeleteApiKeyParamsType,
  DeleteApiKeyReponseType,
  GetApiKeyParamsType,
  GetApiKeyReponseType,
} from "./types";
import { env } from "@/env";
import { revalidateTag } from "next/cache";

export async function deleteApiKey(params: DeleteApiKeyParamsType) {
  const { id } = params;
  const response = await fetch(`${env.BASE_URL}/api/apikey/${id}`, {
    method: "DELETE",
    headers: {
      cookies: (await cookies()).toString(),
      "x-next-internal": "true",
    },
  });
  const data: DeleteApiKeyReponseType = await response.json();
  revalidateTag("apikey");
  revalidateTag("company-apikey");

  if (data.status !== 200) return { error: true, message: data.body.error };

  return {
    error: false,
    message: data.body.message,
  };
}

export async function getApiKey(params: GetApiKeyParamsType) {
  const { id } = params;
  const response = await fetch(`${env.BASE_URL}/api/apikey/${id}`, {
    method: "GET",
    headers: {
      cookies: (await cookies()).toString(),
      "x-next-internal": "true",
    },
    cache: "force-cache",
    next: {
      tags: ["apikey"],
      revalidate: 60,
    },
  });
  const data: GetApiKeyReponseType = await response.json();

  if (data.status !== 200) return { error: true, message: data.body.error };

  return {
    error: false,
    message: data.body.message,
    apiKey: data.body.apiKey,
  };
}
