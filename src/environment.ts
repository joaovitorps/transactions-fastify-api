import { config } from "dotenv";
import * as z from "zod";

if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test" });
} else {
  config({ quiet: true });
}

const Env = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(["sqlite3", "pg"]).default("sqlite3"),
  // coerce here will convert to str to number at runtime since env var is always read like string
  PORT: z.coerce.number().default(8000),
  HOST: z.string().default("localhost"),
});

const result = Env.safeParse(process.env);

if (!result.success) {
  const errorMsg = "⚠️ ENV variables invalid!";
  console.error(errorMsg, z.treeifyError(result.error));
  throw new Error(errorMsg);
}

export const env = result.data;
