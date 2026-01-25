import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import z from "zod";

import { knex } from "../../infra/database/database";

export const transactionsRoutes = async (app: FastifyInstance) => {
  app.post("/", async (request, reply) => {
    const insertTransactionSchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = insertTransactionSchema.parse(request.body);

    await knex("transactions").insert({
      id: randomUUID(),
      title: title,
      amount: type === "credit" ? amount : amount * -1,
    });

    reply.code(201).send();
  });

  app.get("/", async (_request, reply) => {
    const transactions = await knex("transactions").select();

    return { transactions };
  });

  app.get("/:id", async (request) => {
    const reqParamsSchema = z.object({
      id: z.uuidv4(),
    });

    const { id } = reqParamsSchema.parse(request.params);

    const transaction = await knex("transactions").where("id", id).first();

    return { transaction };
  });

  app.get("/summary", async () => {
    const summary = await knex("transactions")
      .sum("amount", { as: "amount" })
      .first();

    return { summary };
  });
};
