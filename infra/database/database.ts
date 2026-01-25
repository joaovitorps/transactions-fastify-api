import { knex as knexSetup, Knex } from "knex";
import "../../src/environment.js";
import { env } from "../../src/environment.js";

export const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./infra/database/migrations",
  },
};

export const knex = knexSetup(config);
