import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Delete cidades", () => {
  test("Apgar", async () => {
    const res1 = await testServer.post("/cidades").send({
      nome: "Caxias do sul",
    });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    const resApagar = await testServer.delete(`/cidades/${res1.body}`).send();
    expect(resApagar.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });
  test("Tentar apagar registo que nao existe",async()=>{
    const res1=await testServer.delete('/cidades/99839').send()
    expect(res1.body).toHaveProperty('errors.default')
  })
});
