import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Prevents multiple instances of Prisma Client during development hot-reloads
const globalForPrisma = global as unknown as { prisma: PrismaClient; pool: Pool };

const connectionString = process.env.DATABASE_URL;

const pool = globalForPrisma.pool || new Pool({ connectionString });
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pool = pool;
}

const adapter = new PrismaPg(pool);

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
