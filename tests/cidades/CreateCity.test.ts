import { beforeAll, describe, expect, test } from 'bun:test';
import { testServer } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';

describe('Create City', () => {
  let accessToken = '';
  beforeAll(async () => {
    const email = 'create-cidades@gmail.com';
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
  test('Tenta criar um registo sem token de accesso', async () => {
    const rescriar = await testServer
      .post('/cidades')
      .send({ nome: 'Caxias do Sul' });
    expect(rescriar.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(rescriar.body).toHaveProperty('errors.default');
  });
  test('Criar cidades', async () => {
    const rescriar = await testServer
      .post('/cidades')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Caxias do Sul' });
    console.log(rescriar.statusCode);
    expect(rescriar.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof rescriar.body).toEqual('number');
  });

  test('Tenta criar um registo com nome curto', async () => {
    const rescriar = await testServer
      .post('/cidades')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Ca',
      });
    expect(rescriar.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(rescriar.body).toHaveProperty('errors.body.nome');
  });
});
