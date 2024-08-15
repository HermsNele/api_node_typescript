import { beforeAll, describe, expect, test } from 'bun:test';
import { testServer } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';

describe('Procura Por todas cidades', () => {
  let accessToken = '';
  beforeAll(async () => {
    const email = 'getall-cidades@gmail.com';
    await testServer
      .post('/cadastrar')
      .send({ email, senha: '123456', nome: 'Teste' });
    const signInRes = await testServer
      .post('/entrar')
      .send({ email, senha: '123456' });

    accessToken = signInRes.body.accessToken;
  });
  test('Pesquisar por todas sem token de acesso', async () => {
    const resPesqCriar = await testServer.post('/cidades').send({
      nome: 'Cambulo',
    });

    expect(resPesqCriar.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
  });
  test('Pesquisar por todas as cidades', async () => {
    const resPesqCriar = await testServer
      .post('/cidades')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Cambulo',
      });

    expect(resPesqCriar.statusCode).toEqual(StatusCodes.CREATED);

    const resPesquisar = await testServer
      .get('/cidades')
      .set({ authorization: `Bearer ${accessToken}` })
      .send();
    expect(Number(resPesquisar.header['x-total-count'])).toBeGreaterThan(0);
    expect(resPesquisar.statusCode).toEqual(StatusCodes.OK);
    expect(resPesquisar.body.length).toBeGreaterThan(0);
  });
});
