"use server";
import { cookies } from "next/headers";
import { CreateApiKeyBodyType, CreateApiKeyReponseType } from "./types";
import { env } from "@/env";
import { revalidateTag } from "next/cache";

export async function createApiKey(body: CreateApiKeyBodyType) {
  const response = await fetch(`${env.BASE_URL}/api/apikey`, {
    method: "POST",
    headers: {
      cookies: (await cookies()).toString(),
      "x-next-internal": "true",
    },
    body: JSON.stringify(body),
  });
  const data: CreateApiKeyReponseType = await response.json();

  if (data.status !== 200) return { error: true, message: data.body.error };
  revalidateTag("apikey");
  revalidateTag("company-apikey");

  return {
    error: false,
    message: data.body.message,
    apiKey: data.body.apiKey,
  };
}
