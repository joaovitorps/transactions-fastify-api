import Fastify from "fastify";
import { knex } from "../infra/database/database.js";
import { env } from "./environment.js";

const app = Fastify();

app.get("/hello", async (_req, _res) =>
  console.log(await knex("sqlite_schema").select("*"))
);

app
  .listen({ port: env.PORT })
  .then(() => console.log(`Server is running at ${env.PORT}!`));
