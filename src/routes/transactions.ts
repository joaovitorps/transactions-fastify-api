import { FastifyInstance } from "fastify";
import { knex } from "../../infra/database/database";

export const transactionsRoutes = async (app: FastifyInstance) => {
  app.get("/hello", async (_req, _res) =>
    console.log(await knex("sqlite_schema").select("*"))
  );
};
