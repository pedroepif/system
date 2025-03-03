"use server";
import { validateUserSession } from "@/app/api/user/session/[token]/actions";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const cookieStorage = await cookies();
  const token = cookieStorage.get("session-token");
  const { error, user } = await validateUserSession({
    token: token?.value || "notFound",
  });
  if (error || !user) return null;

  return user;
}
