import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../../drizzle/schema";

const connectionString = import.meta.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const pool = new Pool({ connectionString });

export const db = drizzle(pool, { schema });
