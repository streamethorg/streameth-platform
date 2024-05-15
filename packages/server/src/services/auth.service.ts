import { IUser } from '@interfaces/user.interface';
import { HttpException } from '@exceptions/HttpException';
import jwt from 'jsonwebtoken';
import { config } from '@config';
import UserService from './user.service';
import { PrivyClient } from '@privy-io/server-auth';

export default class AuthService {
  private userService = new UserService();
  private path: string;
  constructor() {
    this.path = 'auth';
  }

  private privy = new PrivyClient(config.privy.appId, config.privy.appSecret);

  async login(data: IUser): Promise<{ user: IUser; token: string }> {
    let verifyToken = await this.verifyAuthToken(data.token);
    let user = await this.privy.getUser(verifyToken.userId);
    let existingUser = await this.userService.findOne({
      walletAddress: user.wallet.address,
    });
    if (!existingUser) {
      existingUser = await this.userService.create({
        walletAddress: user.wallet.address,
        did: user.id,
      });
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
      const authToken = await this.privy.verifyAuthToken(token);
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
}
