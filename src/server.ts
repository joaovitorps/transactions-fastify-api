import Fastify from "fastify";
import cookies from "@fastify/cookie";
import { env } from "./environment.js";
import { transactionsRoutes } from "./routes/transactions.js";

const app = Fastify();

app.register(cookies);
app.register(transactionsRoutes, {
  prefix: "transactions",
});

app
  .listen({ port: env.PORT })
  .then(() => console.log(`Server is running at ${env.PORT}!`));
