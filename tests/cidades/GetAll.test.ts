import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
describe("Obter todas as cidades", () => {
  test("Buscar todos os registo", async () => {
    const res1 = await testServer.post("/cidades").send({
      nome: "Cambulo",
    });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    const resBuscada = await testServer.get("/cidades").send();

    expect(resBuscada.statusCode).toEqual(StatusCodes.OK);
    expect(resBuscada.body.length).toBeGreaterThan(0);
    expect(Number(resBuscada.headers["x-total-count"])).toBeGreaterThan(0);
    console.log(resBuscada.headers);
  });
});
