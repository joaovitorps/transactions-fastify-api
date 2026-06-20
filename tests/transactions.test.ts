import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { knex } from "../infra/database/database.ts";

describe("transaction routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await knex.migrate.rollback(undefined, false);
    await knex.migrate.latest();
  });

  test("can create a new transaction", async () => {
    await request(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 3000,
        type: "credit",
      })
      .expect(201);
  });

  test("can list all transactions", async () => {
    const transactionBody = {
      title: "New transaction",
      amount: 5000,
      type: "credit",
    };

    const response = await request(app.server)
      .post("/transactions")
      .send(transactionBody);

    const cookies = response.get("Set-Cookie") as string[];

    const listOfTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    expect(listOfTransactionsResponse.body).toEqual({
      transactions: [
        expect.objectContaining({
          title: transactionBody.title,
          amount: transactionBody.amount,
        }),
      ],
    });
  });

  test("can list one transactions", async () => {
    const transactionBody = {
      title: "New transaction",
      amount: 5000,
      type: "credit",
    };

    const response = await request(app.server)
      .post("/transactions")
      .send(transactionBody);

    const cookies = response.get("Set-Cookie") as string[];

    const listOfTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    const transactionId = listOfTransactionsResponse.body.transactions[0].id;

    const transactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(transactionResponse.body).toEqual({
      transaction: expect.objectContaining({
        title: transactionBody.title,
        amount: transactionBody.amount,
      }),
    });
  });

  test("can list user summary", async () => {
    const transactionCreditBody = {
      title: "New transaction",
      amount: 5000,
      type: "credit",
    };

    const response = await request(app.server)
      .post("/transactions")
      .send(transactionCreditBody);

    const transactionDebitBody = {
      title: "New transaction",
      amount: 300,
      type: "debit",
    };

    const cookies = response.get("Set-Cookie") as string[];

    await request(app.server)
      .post("/transactions")
      .set("Cookie", cookies)
      .send(transactionDebitBody);

    const listOfTransactionsResponse = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies)
      .expect(200);

    expect(listOfTransactionsResponse.body).toEqual({
      summary: expect.objectContaining({
        amount: 4700,
      }),
    });
  });

  test("can delete transaction", async () => {
    const transactionCreditBody = {
      title: "New transaction",
      amount: 5000,
      type: "credit",
    };

    const response = await request(app.server)
      .post("/transactions")
      .send(transactionCreditBody);

    const cookies = response.get("Set-Cookie") as string[];


    const listOfTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    const transactionId = listOfTransactionsResponse.body.transactions[0].id;

    const transactionResponse = await request(app.server)
      .delete(`/transactions/${transactionId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(transactionResponse.body).toEqual({
      transaction: 1,
    });
  });
});
