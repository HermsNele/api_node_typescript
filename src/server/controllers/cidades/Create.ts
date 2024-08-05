import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { ICidade } from "../../database/models";
import { CidadesProvider } from "../../database/providers/cidades";

interface IBodyProps extends Omit<ICidade, "id"> {}

// interface ICidade {
//   nome: string;
// } usar este modelo se comecar pelo controlador
// interface IFilter {
//   filter?: string;
// }

export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      nome: yup.string().required().min(3).max(150),
    })
  ),
}));
// query: getSchema<IFilter>(
//   yup.object().shape({
//     filter: yup.string().required().min(3),
//   })

export const create = async (req: Request<{}, {}, ICidade>, res: Response) => {
  const result = await CidadesProvider.create(req.body);
  console.log(result);
  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message,
      },
    });
  }
  console.log(req.body);

  return res.status(StatusCodes.CREATED).json(result);
};
