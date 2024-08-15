import { beforeAll, describe, expect, it } from 'bun:test';
import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';

describe('Pessoas - GetAll', () => {
  let accessToken = '';
  beforeAll(async () => {
    const email = 'getall-pessoas@gmail.com';
    await testServer
      .post('/cadastrar')
      .send({ email, senha: '123456', nome: 'Teste' });
    const signInRes = await testServer
      .post('/entrar')
      .send({ email, senha: '123456' });

    accessToken = signInRes.body.accessToken;
    console.log(email);
  });

  let cidadeId: number | undefined = undefined;
  beforeAll(async () => {
    const resCidade = await testServer
      .post('/cidades')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Teste' });

    cidadeId = resCidade.body;
    console.log(cidadeId);
  });
  it('Busca registros sem token', async () => {
    const res1 = await testServer.post('/pessoas').send({
      cidadeId,
      email: 'gijaspower@gmail.com',
      nomeCompleto: 'Gijas Brejnev',
    });
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });
  it('Busca registros', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: 'gijaspower@gmail.com',
        nomeCompleto: 'Gijas Brejnev',
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    const resBuscada = await testServer
      .get('/pessoas')
      .set({ authorization: `Bearer ${accessToken}` })
      .send();
    expect(Number(resBuscada.header['x-total-count'])).toBeGreaterThan(0);
    expect(resBuscada.statusCode).toEqual(StatusCodes.OK);
    expect(resBuscada.body.length).toBeGreaterThan(0);
  });
});
