import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BASE_URL: z.string().url(),
    SECRET: z.string(),
    EMAIL_SERVER: z.string().url(),
    EMAIL_FROM: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  clientPrefix: "PUBLIC_",
  client: {},
  runtimeEnv: process.env,
});
