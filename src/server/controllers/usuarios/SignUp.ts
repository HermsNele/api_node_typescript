import { Request, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../shared/middlewares';
import { StatusCodes } from 'http-status-codes';
import { IUsuario } from '../../database/models';
import { UsuariosProvider } from '../../database/providers/usuarios';

interface IBodyProps extends Omit<IUsuario, 'id'> {}

export const signUpValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      nome: yup.string().required().min(3),
      senha: yup.string().required().min(6),
      email: yup.string().required().email().min(5),
    })
  ),
}));

export const signUp = async (req: Request<{}, {}, IUsuario>, res: Response) => {
  const result = await UsuariosProvider.create(req.body);
  console.log(result);
  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message,
      },
    });
  }

  return res.status(StatusCodes.CREATED).json(result);
};
