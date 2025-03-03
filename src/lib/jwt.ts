"use server";
import { type JWTPayload, jwtVerify, SignJWT } from "jose";
import { env } from "@/env";

const SECRET = new TextEncoder().encode(env.SECRET);

export async function signJwt(payload: JWTPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(SECRET);
}

export async function verifyJwt<T = object>(token: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as T;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}
