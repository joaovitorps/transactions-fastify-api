import "dotenv/config";
import * as z from "zod";

const Env = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: z.string(),
  // coerce here will convert to str to number at runtime since env var is always read like string
  PORT: z.coerce.number().default(8000),
});

const result = Env.safeParse(process.env);

if (!result.success) {
  const errorMsg = "⚠️ ENV variables invalid!";
  console.error(errorMsg, z.treeifyError(result.error));
  throw new Error(errorMsg);
}

export const env = result.data;
