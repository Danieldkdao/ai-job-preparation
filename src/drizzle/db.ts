import { env } from "@/data/env/server";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/drizzle/schema";
// Local database
// import { drizzle } from "drizzle-orm/node-postgres";

const sql = neon(env.DATABASE_URL);
export const db = drizzle({ client: sql, schema });

// Local database
// export const db = drizzle(env.DATABASE_URL, { schema });
