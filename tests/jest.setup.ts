import { server } from '../src/server/Server';
import supertest from 'supertest';
import { Knex } from '../src/server/database/knex';
import { beforeAll, afterAll } from 'bun:test';

beforeAll(async () => {
  await Knex.migrate.latest();
});

// afterAll(async () => {
//   await Knex.destroy();
// });

export const testServer = supertest(server);
