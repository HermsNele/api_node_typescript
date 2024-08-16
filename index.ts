import { Knex } from './src/server/database/knex';
import { server } from './src/server/Server';
import 'dotenv/config';
console.log('I restarted at:', Date.now());
const port = process.env.PORT || 4000;
const startServer = () => {
  server.listen(port, () => {
    console.log(`App rodando na porta ${port}`);
  });
};

if (process.env.IS_LOCALHOST !== 'true') {
  console.log(process.env.IS_LOCALHOST);
  Knex.migrate
    .latest()
    .then(() => {
      Knex.seed
        .run()
        .then(() => startServer())
        .catch(console.log);
    })
    .catch(console.log);
} else {
  startServer();
}
