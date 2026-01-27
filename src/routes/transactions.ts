import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import z from "zod";

import { knex } from "../../infra/database/database";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export const transactionsRoutes = async (app: FastifyInstance) => {
  app.post("/", async (request, reply) => {
    const insertTransactionSchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = insertTransactionSchema.parse(request.body);

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex("transactions").insert({
      id: randomUUID(),
      title: title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    });

    reply.code(201).send();
  });

  app.get("/", { preHandler: [checkSessionIdExists] }, async (request) => {
    const sessionId = request.cookies.sessionId as string;

    const transactions = await knex("transactions")
      .select()
      .where("session_id", sessionId);

    return { transactions };
  });

  app.get("/:id", { preHandler: [checkSessionIdExists] }, async (request) => {
    const reqParamsSchema = z.object({
      id: z.uuidv4(),
    });

    const { id } = reqParamsSchema.parse(request.params);
    const sessionId = request.cookies.sessionId as string;

    const transaction = await knex("transactions")
      .where({ id, session_id: sessionId })
      .first();

    return { transaction };
  });

  app.get(
    "/summary",
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const sessionId = request.cookies.sessionId as string;

      const summary = await knex("transactions")
        .where("session_id", sessionId)
        .sum("amount", { as: "amount" })
        .first();

      return { summary };
    },
  );

  app.post("/migrations", async (_request, reply) => {
    await knex.migrate.latest();

    return reply.status(200).send();
  });
};
