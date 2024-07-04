import { config } from '@config';
import User from '@models/user.model';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

export const getTokenHeader = (req: Request): string | null => {
  const header = req.header('Authorization');
  if (header) {
    return req.header('Authorization').split('Bearer ')[1];
  }
  return null;
};

export const expressAuthentication = async (
  req: Request,
  securityName: string,
  scopes?: string[]
) => {
  if (securityName === 'jwt') {
    const token = getTokenHeader(req);
    if (!token) {
      throw new Error('Authentication failed: No token provided');
    }
    try {
      const decoded: any = jwt.verify(token, config.jwt.secret);
      const user = await User.findOne({ walletAddress: decoded.id });
      if (!user) {
        throw new Error('Authentication Failed/Invalid Token');
      }
      if (
        scopes.length > 0 &&
        !user.organizations.includes(
          req.body.organizationId ?? req.params.organizationId
        )
      ) {
        throw new Error('Insufficient permissions to execute action');
      }
      return user;
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        throw new Error('Authentication Failed/Invalid Token');
      }
      throw e;
    }
  }
};
