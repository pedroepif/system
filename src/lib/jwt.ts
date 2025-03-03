"use server";
import jwt from "jsonwebtoken";
import { env } from "@/env";

const SECRET = env.SECRET;

export async function signJwt(payload: object) {
  return jwt.sign(payload, SECRET);
}

export async function verifyJwt<T = object>(token: string): Promise<T | null> {
  try {
    return jwt.verify(token, SECRET) as T;
  } catch (err) {
    console.log(err);
    return null;
  }
}
