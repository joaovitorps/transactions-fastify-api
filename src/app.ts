import fastify from "fastify";
import cookies from "@fastify/cookie";
import fastifyCors from "@fastify/cors";

import { transactionsRoutes } from "./routes/transactions";
import { env } from "./environment";

export const app = fastify();

app.register(fastifyCors, {
  origin: env.WEB_DOMAIN,
  credentials: true,
})

app.setErrorHandler((error,_,res) => {
  if(error instanceof Error) {
    if(error.message.includes("no such table")) {
      return res.status(400).send({message: "Please, run migrations to get started!"})
    }
  }

  console.log(error)

  return res.status(500).send()
})

app.register(cookies);
app.register(transactionsRoutes, {
  prefix: "transactions",
});
