import { Router } from 'express';
import {
  CidadesController,
  PessoasController,
  UsuariosController,
} from '../controllers';
import { ensureAuthenticated } from 'server/shared/middlewares';

const router = Router();
router.get('/', (_, res) => {
  return res.send('Ola, DEV!');
});

router.post(
  '/cidades',
  ensureAuthenticated,
  CidadesController.createValidation,
  CidadesController.create
);
router.get(
  '/cidades/:id',
  ensureAuthenticated,
  CidadesController.getByIdValidation,
  CidadesController.getById
);
router.get(
  '/cidades',
  ensureAuthenticated,
  CidadesController.getAllValidation,
  CidadesController.getAll
);
router.put(
  '/cidades/:id',
  ensureAuthenticated,
  CidadesController.updateByIdValidation,
  CidadesController.updateById
);
router.delete(
  '/cidades/:id',
  ensureAuthenticated,
  CidadesController.deleteByIdValidation,
  CidadesController.deleteById
);
router.post(
  '/pessoas',
  ensureAuthenticated,
  PessoasController.createValidation,
  PessoasController.create
);
router.get(
  '/pessoas/:id',
  ensureAuthenticated,
  PessoasController.getByIdValidation,
  PessoasController.getById
);
router.get(
  '/pessoas',
  ensureAuthenticated,
  PessoasController.getAllValidation,
  PessoasController.getAll
);
router.put(
  '/pessoas/:id',
  ensureAuthenticated,
  PessoasController.updateByIdValidation,
  PessoasController.updateById
);
router.delete(
  '/pessoas/:id',
  ensureAuthenticated,
  PessoasController.deleteByIdValidation,
  PessoasController.deleteById
);
router.post(
  '/entrar',
  UsuariosController.signInValidation,
  UsuariosController.signIn
);
router.post(
  '/cadastrar',
  UsuariosController.signUpValidation,
  UsuariosController.signUp
);

export { router };
