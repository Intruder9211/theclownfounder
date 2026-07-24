import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";

// Prevents multiple instances of Prisma Client during development hot-reloads
const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  const adapter = new PrismaBetterSqlite3({ url: "dev.db" });
  prisma = new PrismaClient({ adapter });
} else {
  // Fresh PrismaClient in development to incorporate schema migrations dynamically
  const adapter = new PrismaBetterSqlite3({ url: "dev.db" });
  prisma = new PrismaClient({ adapter });
  globalForPrisma.prisma = prisma;
}

export const db = prisma;
