import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    ANALYZE: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    NEXTAUTH_URL: z.string().url(),
    DEV_GITHUB_SECRET: z.string(),
    GITHUB_SECRET: z.string(),
    DEV_GITHUB_ID: z.string(),
    GITHUB_ID: z.string(),
    SENDER_PASSWORD: z.string(),
    SENDER_EMAIL: z.string().email(),
    NEXTAUTH_SECRET: z.string().length(32),
    FAUNADB_DOMAIN: z.string(),
    NEXT_PUBLIC_SECURE_KEY: z.string().length(32),
    NEXT_PUBLIC_DEV_FAUNA_USER_KEY: z.string(),
    NEXT_PUBLIC_FAUNA_USER_KEY: z.string(),
    DEV_FAUNA_ADMIN_KEY: z.string(),
    FAUNA_ADMIN_KEY: z.string()
  },
  client: {
    NEXTAUTH_URL: z.string().url(),
    DEV_GITHUB_SECRET: z.string(),
    GITHUB_SECRET: z.string(),
    DEV_GITHUB_ID: z.string(),
    GITHUB_ID: z.string(),
    SENDER_PASSWORD: z.string(),
    SENDER_EMAIL: z.string().email(),
    NEXTAUTH_SECRET: z.string().length(32),
    FAUNADB_DOMAIN: z.string(),
    NEXT_PUBLIC_SECURE_KEY: z.string().length(32),
    NEXT_PUBLIC_DEV_FAUNA_USER_KEY: z.string(),
    NEXT_PUBLIC_FAUNA_USER_KEY: z.string(),
    DEV_FAUNA_ADMIN_KEY: z.string(),
    FAUNA_ADMIN_KEY: z.string()
  },
  runtimeEnv: {
    ANALYZE: process.env.ANALYZE,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DEV_GITHUB_SECRET: process.env.DEV_GITHUB_SECRET,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    DEV_GITHUB_ID: process.env.DEV_GITHUB_ID,
    GITHUB_ID: process.env.GITHUB_ID,
    SENDER_PASSWORD: process.env.SENDER_PASSWORD,
    SENDER_EMAIL: process.env.SENDER_EMAIL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    FAUNADB_DOMAIN: process.env.FAUNADB_DOMAIN,
    NEXT_PUBLIC_SECURE_KEY: process.env.NEXT_PUBLIC_SECURE_KEY,
    NEXT_PUBLIC_DEV_FAUNA_USER_KEY: process.env.NEXT_PUBLIC_DEV_FAUNA_USER_KEY,
    NEXT_PUBLIC_FAUNA_USER_KEY: process.env.NEXT_PUBLIC_FAUNA_USER_KEY,
    DEV_FAUNA_ADMIN_KEY: process.env.DEV_FAUNA_ADMIN_KEY,
    FAUNA_ADMIN_KEY: process.env.FAUNA_ADMIN_KEY
  },
})
