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
    const transactions = await knex("transactions").select("*");
    console.log(transactions);
    reply.code(200).send(transactions);
  });
};
