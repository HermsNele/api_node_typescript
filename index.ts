import { Knex } from './src/server/database/knex';
import { server } from './src/server/Server';
import 'dotenv/config';
console.log('I restarted at:', Date.now());
const startServer = () => {
  server.listen(process.env.PORT || 4000, () => {
    console.log(`App rodando na porta ${process.env.PORT}`);
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
