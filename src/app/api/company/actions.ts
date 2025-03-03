"use server";
import { cookies } from "next/headers";
import { CreateCompanyBodyType, CreateCompanyReponseType } from "./types";
import { env } from "@/env";
import { revalidateTag } from "next/cache";

export async function createCompany(body: CreateCompanyBodyType) {
  const response = await fetch(`${env.BASE_URL}/api/company`, {
    method: "POST",
    headers: {
      cookies: (await cookies()).toString(),
    },
    body: JSON.stringify(body),
  });
  const data: CreateCompanyReponseType = await response.json();

  if (data.status !== 200) return { error: true, message: data.body.error };
  revalidateTag("user-permission");
  revalidateTag("company");

  return {
    error: false,
    message: data.body.message,
    company: data.body.company,
  };
}
