import { describe, expect, it } from 'bun:test';
import { testServer } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';

describe('Testa controller de cadastro de usuario', () => {
  it('Cadastra usuario 1', async () => {
    const res1 = await testServer.post('/cadastrar').send({
      senha: '123456',
      nome: 'Herms Brej',
      email: 'hermbrej@gmail.com',
    });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });
  it('Cadastra usuario 2', async () => {
    const res1 = await testServer.post('/cadastrar').send({
      senha: '123456',
      nome: 'Brej Brej',
      email: 'brejjunior@gmail.com',
    });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });
  it('Cadastra um usuario com email duplicado', async () => {
    const res1 = await testServer.post('/cadastrar').send({
      senha: '123456',
      nome: 'Brej Brej',
      email: 'brejjuniorduplicado@gmail.com',
    });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
    const res2 = await testServer.post('/cadastrar').send({
      senha: '123456',
      nome: 'Brej Brej',
      email: 'brejjuniorduplicado@gmail.com',
    });
    expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res2.body).toHaveProperty('errors.default');
  });
  it('Erro ao cadastrar um usuario sem email', async () => {
    const res1 = await testServer.post('/cadastrar').send({
      senha: '123456',
      nome: 'Brej Brej',
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });
  it('Erro ao cadastrar um usuario sem nome', async () => {
    const res1 = await testServer.post('/cadastrar').send({
      senha: '123456',
      email: 'brejjuniord@gmail.com',
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });
  it('Erro ao cadastrar um usuario sem senha', async () => {
    const res1 = await testServer.post('/cadastrar').send({
      nome: 'Brej Brej',
      email: 'brejjuniord@gmail.com',
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.senha');
  });
  it('Erro ao cadastrar um usuario email invalido', async () => {
    const res1 = await testServer.post('/cadastrar').send({
      nome: 'Brej Brej',
      senha: '123456',
      email: 'brejjuniord @gmail.com',
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });
  it('Erro ao cadastrar um usuario com senha muito curta', async () => {
    const res1 = await testServer.post('/cadastrar').send({
      nome: 'Brej Brej',
      senha: '1234',
      email: 'brejjuniord @gmail.com',
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.senha');
  });
  it('Erro ao cadastrar um usuario com nome muito curta', async () => {
    const res1 = await testServer.post('/cadastrar').send({
      nome: 'Br',
      senha: '1234',
      email: 'brejjuniord @gmail.com',
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });
});
