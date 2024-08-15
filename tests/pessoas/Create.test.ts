import { beforeAll, describe, expect, it } from 'bun:test';
import { testServer } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';

describe('Pessoas-Create', () => {
  let accessToken = '';
  beforeAll(async () => {
    const email = 'create-pessoas@gmail.com';
    await testServer.post('/cadastrar').send({
      nome: 'Teste',
      email,
      senha: '123456',
    });
    const signInRes = await testServer.post('/entrar').send({
      email,
      senha: '123456',
    });
    accessToken = signInRes.body.accessToken;
  });

  let cidadeId: number | undefined = undefined;
  beforeAll(async () => {
    const resCidade = await testServer
      .post('/cidades')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Teste',
      });
    cidadeId = resCidade.body;
  });
  it('Tenta criar registo sem token', async () => {
    const res1 = await testServer.post('/pessoas').send({
      cidadeId: 'teste',
      nomeCompleto: 'Gijas Power',
      email: 'Gijaspower@gmail.com',
    });
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });
  it('Cria registo', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: 'gijaspowercreate@gmail.com',
        nomeCompleto: 'Gijas Brejnev',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });
  it('Cria registo 2', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: 'gijaspowercreate2@gmail.com',
        nomeCompleto: 'Gijas Brejnev',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });
  it('Tenta criar registo com email duplicado', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: 'gijaspowerduplicado@gmail.com',
        nomeCompleto: 'Gijas Brejnev',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
    const res2 = await testServer
      .post('/pessoas')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: 'gijaspowerduplicado@gmail.com',
        nomeCompleto: 'duplicado',
      });
    expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res2.body).toHaveProperty('errors.default');
  });
  it('Tenta criar registo com nomeCompleto muito curto', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: 'gijaspower@gmail.com',
        nomeCompleto: 'Gi',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nomeCompleto');
  });
  it('Tenta criar registo sem nomeCompleto', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: 'gijaspower@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nomeCompleto');
  });
  it('Tenta criar registo sem email', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nomeCompleto: 'Gi',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });
  it('Tenta criar registo com email invalido', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nomeCompleto: 'Gijas Power',
        email: 'Juca gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });
  it('Tenta criar registo sem cidadeId', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        nomeCompleto: 'Gijas Power',
        email: 'Gijaspower@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.cidadeId');
  });
  it('Tenta criar registo com cidadeId invalido', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId: 'teste',
        nomeCompleto: 'Gijas Power',
        email: 'Gijaspower@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.cidadeId');
  });
  it('Tenta criar registo sem enviar nenhum propriedade', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({});
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nomeCompleto');
    expect(res1.body).toHaveProperty('errors.body.cidadeId');
    expect(res1.body).toHaveProperty('errors.body.email');
  });
});
