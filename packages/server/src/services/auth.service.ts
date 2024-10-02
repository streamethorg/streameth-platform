import { config } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { IUser } from '@interfaces/user.interface';
import { validateToken } from '@utils/oauth';
import jwt from 'jsonwebtoken';
import UserService from './user.service';

export default class AuthService {
  private userService = new UserService();
  private path: string;
  constructor() {
    this.path = 'auth';
  }

  async login(data: IUser): Promise<{ user: IUser; token: string }> {
    let verifyToken = await this.verifyAuthToken(data.token);
    let user = await this.userService.findOne({ email: verifyToken.email });
    if (!user) {
      user = await this.userService.create({
        email: verifyToken.email,
        did: verifyToken.userId,
      });
    }
    let token = jwt.sign({ id: verifyToken.userId }, config.jwt.secret, {
      expiresIn: config.jwt.expiry,
    });
    return { user, token };
  }

  async verifyAuthToken(
    token: string,
  ): Promise<{ userId: string; email: string }> {
    try {
      const authToken = await validateToken(token);
      return {
        userId: authToken.userId,
        email: authToken.email,
      };
    } catch (e) {
      if (e.message === 'Invalid or expired token') {
        throw new HttpException(401, 'Invalid token');
      }
      if(e.message === 'Token expired') {
        throw new HttpException(401, 'Token expired');
      }
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, config.jwt.secret);
      return true;
    } catch (e) {
      if (
        e instanceof jwt.TokenExpiredError ||
        e instanceof jwt.JsonWebTokenError
      ) {
        return false;
      }
      return false;
    }
  }
}
