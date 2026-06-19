import fastify from "fastify";
import cookies from "@fastify/cookie";

import { transactionsRoutes } from "./routes/transactions";

export const app = fastify();

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
