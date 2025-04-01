import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

const getDB = (db: D1Database) => {
  const adapter = new PrismaD1(db);
  return new PrismaClient({ adapter });
};

export const getAuth = (db: D1Database) => {
  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: prismaAdapter(getDB(db), {
      provider: "sqlite",
    }),
    emailAndPassword: {
      enabled: true,
    },
  });
};
