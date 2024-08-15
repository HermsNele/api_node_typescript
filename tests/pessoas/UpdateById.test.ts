import { beforeAll, describe, expect, it } from 'bun:test';
import { testServer } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';

describe('Pessoas-UpdateById', () => {
  let accessToken = '';
  beforeAll(async () => {
    const email = 'update-pessoas@gmail.com';
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

  it('Tenta atualizar registo que sem token', async () => {
    const res1 = await testServer.put('/pessoas/1').send({
      cidadeId,
      email: 'gijaspower@gmail.com',
      nomeCompleto: 'Gijas Brejnev',
    });
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Atualiza registo', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: 'gijaspowerupdate@gmail.com',
        nomeCompleto: 'Gijas Brejnev',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    const resAtualizar = await testServer
      .put(`/pessoas/${res1.body}`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: 'gijaspowerupdates@gmail.com',
        nomeCompleto: 'Gijas Brejnev',
      });
    expect(resAtualizar.statusCode).toEqual(StatusCodes.NO_CONTENT);
    const verUpdated = await testServer
      .get(`/pessoas/${res1.body}`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();
    expect(verUpdated.statusCode).toEqual(StatusCodes.OK);
  });

  it('Tenta atualizar registo que nao existe', async () => {
    const res1 = await testServer
      .put('/pessoas/99999')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: 'gijaspower@gmail.com',
        nomeCompleto: 'Gijas Brejnev',
      });
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});
