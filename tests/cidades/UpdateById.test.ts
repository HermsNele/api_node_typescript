import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';

describe('Cidades - UpdateById', () => {
  let accessToken = '';
  beforeAll(async () => {
    const email = 'update-cidades@gmail.com';
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

  it('Tenta atualizar registro que não existe', async () => {
    const res1 = await testServer.put('/cidades/1').send({ nome: 'Caxias' });

    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });
  it('Atualiza registro', async () => {
    const res1 = await testServer
      .post('/cidades')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Caxias do sul' });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualizada = await testServer
      .put(`/cidades/${res1.body}`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Caxias' });

    expect(resAtualizada.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });
  it('Tenta atualizar registro que não existe', async () => {
    const res1 = await testServer
      .put('/cidades/99999')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Caxias' });

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});
