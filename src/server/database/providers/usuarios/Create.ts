import { IUsuario } from '../../models';
import { Knex } from '../../knex';
import { ETableNames } from '../../ETableNames';
import { PasswordCrypto } from 'server/shared/services';

export const create = async (
  usuario: Omit<IUsuario, 'id'>
): Promise<number | Error> => {
  try {
    const hashedPassword = await PasswordCrypto.hashPassword(usuario.senha);
    const [result] = await Knex(ETableNames.usuario)
      .insert({ ...usuario, senha: hashedPassword })
      .returning('id');
    if (typeof result === 'object') {
      return result.id;
    } else if (typeof result === 'number') {
      return result;
    }
    return new Error('Erro ao cadastrar o registo');
  } catch (error) {
    console.log(error);
    return Error('Erro ao cadastrar o registo');
  }
};
