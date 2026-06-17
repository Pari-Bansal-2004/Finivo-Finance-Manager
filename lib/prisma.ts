import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or DIRECT_URL is not defined in environment variables');
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const db = (globalThis as any).prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  (globalThis as any).prisma = db;
}