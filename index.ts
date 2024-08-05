import { Knex } from "./src/server/database/knex";
import { server } from "./src/server/Server";
console.log("I restarted at:", Date.now());
const startServer = () => {
  server.listen(Bun.env["PORT"] || 3333, () => {
    console.log(`App rodando na porta ${process.env["PORT"] || 3333}`);
  });
};
if (process.env.IS_LOCALHOST !== "true") {
  Knex.migrate
    .latest()
    .then(() => {
      startServer();
    })
    .catch(console.log);
} else {
  startServer();
}
