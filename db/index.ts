import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalDb = globalThis as unknown as { ecexPostgres?: ReturnType<typeof postgres> };

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured.");
  const client = globalDb.ecexPostgres ?? postgres(connectionString, { max: 1, prepare: false, idle_timeout: 20 });
  if (process.env.NODE_ENV !== "production") globalDb.ecexPostgres = client;
  return drizzle(client, { schema });
}
