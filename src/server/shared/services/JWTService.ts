import * as jwt from 'jsonwebtoken';
interface IJwtData {
  uid: number;
}
const sign = (data: IJwtData): string | 'JWT_KEY_NOT_FOUND' => {
  if (!process.env.JWT_KEY) return 'JWT_KEY_NOT_FOUND';
  return jwt.sign(data, process.env.JWT_KEY, { expiresIn: '24h' });
};
const verify = (
  token: string
): IJwtData | 'JWT_KEY_NOT_FOUND' | 'INVALID_TOKEN' => {
  if (!process.env.JWT_KEY) return 'JWT_KEY_NOT_FOUND';
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    //se for string vindo do decoded, token invalido
    if (typeof decoded === 'string') {
      return 'INVALID_TOKEN';
    }
    return decoded as IJwtData;
  } catch (error) {
    return 'INVALID_TOKEN';
  }
};

export const JWTService = {
  sign,
  verify,
};
