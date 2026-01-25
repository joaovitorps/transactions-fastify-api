import Fastify from "fastify";
import { env } from "./environment.js";
import { transactionsRoutes } from "./routes/transactions.js";

const app = Fastify();

app.register(transactionsRoutes);

app
  .listen({ port: env.PORT })
  .then(() => console.log(`Server is running at ${env.PORT}!`));
