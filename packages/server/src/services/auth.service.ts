import { IUser } from '@interfaces/user.interface';
import { HttpException } from '@exceptions/HttpException';
import jwt from 'jsonwebtoken';
import { config } from '@config';
import UserService from './user.service';
import privy from '@utils/privy';

export default class AuthService {
  private userService = new UserService();
  private path: string;
  constructor() {
    this.path = 'auth';
  }

  async login(data: IUser): Promise<{ user: IUser; token: string }> {
    let verifyToken = await this.verifyAuthToken(data.token);
    let user = await privy.getUser(verifyToken.userId);
    let existingUser = await this.userService.findOne({
      walletAddress: user.wallet.address,
    });

    if (!existingUser) {
      await privy.deleteUser(verifyToken.userId);
      throw new HttpException(404, 'User not found');
    }

    let token = jwt.sign(
      { id: existingUser.walletAddress },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiry,
      },
    );
    return { user: existingUser, token: token };
  }

  async verifyAuthToken(
    token: string,
  ): Promise<{ userId: string; sessionId: string }> {
    try {
      const authToken = await privy.verifyAuthToken(token);
      return {
        userId: authToken.userId,
        sessionId: authToken.sessionId,
      };
    } catch (e) {
      if (e.code == 'ERR_JWT_EXPIRED') {
        throw new HttpException(401, 'Jwt Expired');
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
