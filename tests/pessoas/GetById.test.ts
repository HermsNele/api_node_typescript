import { beforeAll, describe, expect, it } from 'bun:test';
import { testServer } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';

describe('Pessoas-GetById', () => {
  let accessToken = '';
  beforeAll(async () => {
    const email = 'getbyid-cidades@gmail.com';
    await testServer
      .post('/cadastrar')
      .send({ email, senha: '123456', nome: 'Teste' });
    const signInRes = await testServer
      .post('/entrar')
      .send({ email, senha: '123456' });

    accessToken = signInRes.body.accessToken;
  });

  let cidadeId: number | undefined = undefined;
  beforeAll(async () => {
    const resCidade = await testServer
      .post('/cidades')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Teste' });
    cidadeId = resCidade.body;
  });
  it('Tenta  buscar registo sem token', async () => {
    const res1 = await testServer.get('/pessoas/1').send();
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Busca registo por id', async () => {
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
      .get(`/pessoas/${res1.body}`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();
    expect(resBuscada.statusCode).toEqual(StatusCodes.OK);
    expect(resBuscada.body).toHaveProperty('nomeCompleto');
  });
  it('Tenta  buscar registo que nao existe', async () => {
    const res1 = await testServer
      .get('/pessoas/999998')
      .set({ authorization: `Bearer ${accessToken}` })
      .send();
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});
