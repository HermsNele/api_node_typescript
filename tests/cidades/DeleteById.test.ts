import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('Delete city by Id', () => {
  let accessToken = '';
  beforeAll(async () => {
    const email = 'delete-cidades@gmail.com';
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
  it('Tenta apagar registro que sem token', async () => {
    const res1 = await testServer.delete('/cidades/1').send();

    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });
  it('Apagar registo de cidades', async () => {
    const rescriar_city = await testServer
      .post('/cidades')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Caxias do Sul',
      });
    expect(rescriar_city.statusCode).toEqual(StatusCodes.CREATED);
    const resapagar_city = await testServer
      .delete(`/cidades/${rescriar_city.body}`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();
    expect(resapagar_city.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });
  it('Tenta apagar registro que não existe', async () => {
    const res1 = await testServer
      .delete('/cidades/99999')
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});
