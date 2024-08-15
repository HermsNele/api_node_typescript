import { beforeAll, describe, expect, it } from 'bun:test';
import { testServer } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';

describe('Pessoas-DeletebyId', async () => {
  let accessToken = '';
  beforeAll(async () => {
    const email = 'del-pessoas@gmail.com';
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
      .send({ nome: 'Teste' });
    cidadeId = resCidade.body;
  });
  it('Tenta apagar registo sem token', async () => {
    const res1 = await testServer.delete('/pessoas/1').send();
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Apaga registo', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: 'gijas@gmail.com',
        nomeCompleto: 'Gijas Power',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    const resApagada = await testServer
      .delete(`/pessoas/${res1.body}`)
      .set({ authorization: `Bearer ${accessToken}` });
    expect(resApagada.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });
  it('Tenta apagar registo que nao existe', async () => {
    const res1 = await testServer
      .delete('/pessoas/99999')
      .set({ authorization: `Bearer ${accessToken}` })
      .send();
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});
