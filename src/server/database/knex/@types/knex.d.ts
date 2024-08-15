import { ICidade, IPessoa, IUsuario } from '../../models';

declare module 'knew/types/table' {
  interface Tables {
    cidade: ICidade;
    pessoa: IPessoa;
    usuario: IUsuario;
  }
}
