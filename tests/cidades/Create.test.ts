import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Este criar cidades", () => {
  test("Cria registo", async () => {
    const response = await testServer
      .post("/cidades")
      .send({ nome: "Cambulo" });
    console.log(response.body);
    expect(response.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof response.body).toEqual("number");
  });
  test("Tenta criar um registo com nome muito curto", async () => {
    const response = await testServer.post("/cidades").send({
      nome: "Ca",
    });
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body).toHaveProperty("errors.body.nome");
  });
});
