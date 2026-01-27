import { env } from "./environment.js";
import { app } from "./app.js";

app
  .listen({ port: env.PORT })
  .then(() => console.log(`Server is running at ${env.PORT}!`));
