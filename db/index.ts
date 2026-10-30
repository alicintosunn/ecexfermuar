import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalDb = globalThis as unknown as { ecexPostgres?: ReturnType<typeof postgres> };

export function getDb() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) throw new Error("DATABASE_URL or POSTGRES_URL is not configured.");
  // Reuse one small pool for the lifetime of the Vercel function instance.
  // Creating a pool on every getDb() call exhausts Supavisor connections.
  const client = globalDb.ecexPostgres ?? postgres(connectionString, {
    // Keep each serverless instance deliberately tiny. Supavisor multiplexes
    // these short-lived connections across Vercel instances. Four allows the
    // page and backup queries to run concurrently without an unbounded pool.
    max: 4,
    prepare: false,
    idle_timeout: 5,
    max_lifetime: 60,
    connect_timeout: 10,
  });
  globalDb.ecexPostgres = client;
  return drizzle(client, { schema });
}
