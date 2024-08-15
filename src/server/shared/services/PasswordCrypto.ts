import { compare, genSalt, hash } from 'bcryptjs';
import { password } from 'bun';

const SALT_RANDOMS = 8;
const hashPassword = async (password: string) => {
  // const saltGenerated = await genSalt(SALT_RANDOMS);
  //return await hash(password,saltGenerated)
  // use bcrypt
  const bcryptHash = await Bun.password.hash(password, {
    algorithm: 'bcrypt',
    cost: 4, // number between 4-31
  });
  return bcryptHash;
};
const verifyPassword = async (password: string, hashedPassword: string) => {
  //return await compare(password, hashedPassword);
  const isMatch = await Bun.password.verify(password, hashedPassword);
  return isMatch;
};
export const PasswordCrypto = {
  hashPassword,
  verifyPassword,
};
