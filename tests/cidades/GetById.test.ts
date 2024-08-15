import { beforeAll, describe, expect, it } from 'bun:test';
import { testServer } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';
describe('Procurar por Id', () => {
  let accessToken = '';
  beforeAll(async () => {
    const email = 'getbyid-cidades@gmail.com';
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

  it('Tenta buscar registro sem token', async () => {
    const res1 = await testServer.get('/cidades/1').send();
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });
  it('Procurar cidades por ID', async () => {
    const criar_city = await testServer
      .post('/cidades')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Caxias do Sul',
      });
    expect(criar_city.statusCode).toEqual(StatusCodes.CREATED);
    const buscarcity = await testServer
      .get(`/cidades/${criar_city.body}`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();
    expect(buscarcity.statusCode).toEqual(StatusCodes.OK);
    expect(buscarcity.body).toHaveProperty('nome');
  });

  it('Tenta buscar registro que não existe', async () => {
    const res1 = await testServer
      .get('/cidades/99999')
      .set({ authorization: `Bearer ${accessToken}` })
      .send();
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});
