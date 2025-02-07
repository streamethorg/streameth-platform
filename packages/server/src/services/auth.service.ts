import { config } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { AuthType, IAuth } from '@interfaces/auth.interface';
import { IUser } from '@interfaces/user.interface';
import EmailService from '@utils/mail.service';
import { validateToken } from '@utils/oauth';
import { generateDID, replacePlaceHolders } from '@utils/util';
import crypto from 'crypto';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';
import UserService from './user.service';

export default class AuthService {
  private userService = new UserService();
  private mailService = new EmailService();

  async login(data: IAuth): Promise<{ user: IUser; token: string; redirect?: string }> {
    let verifyToken = await this.verifyAuthToken({
      token: data.token,
      type: data.type,
      email: data.email,
    });
    let user = await this.userService.findOne({
      email: verifyToken.email,
    });

    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      user = await this.userService.create({
        email: verifyToken.email,
        did: generateDID(),
      });
    }

    let token = jwt.sign({ id: user.did, email: user.email }, config.jwt.secret, {
      expiresIn: config.jwt.expiry,
    });

    // Always check for organizations regardless of environment
    const hasNoOrganizations = !user.organizations || user.organizations.length === 0;
    const redirect = isNewUser || hasNoOrganizations ? '/studio/create' : '/studio';

    return { user, token, redirect };
  }

  async verifyAuthToken(d: {
    token: string;
    type: string;
    email?: string;
  }): Promise<{ email: string }> {
    try {
      if (d.type === AuthType.email) {
        await this.verifyMagicLinkToken(d.token);
        return {
          email: d.email,
        };
      }
      if (d.type === AuthType.google) {
        const authToken = await validateToken(d.token);
        return {
          email: authToken.email,
        };
      }
    } catch (e) {
      if (e.message === 'Invalid or expired token') {
        throw new HttpException(401, 'Invalid token');
      }
      if (e.message === 'Token expired') {
        throw new HttpException(401, 'Token expired');
      }
    }
  }

  async verifyMagicLinkToken(token: string): Promise<void> {
    try {
      jwt.verify(token, config.jwt.magicLink.secret);
    } catch (e) {
      if (
        e instanceof jwt.TokenExpiredError ||
        e instanceof jwt.JsonWebTokenError
      ) {
        throw new HttpException(401, 'Token expired');
      }
      throw new HttpException(401, 'Invalid token');
    }
  }

  async verifyToken(token: string): Promise<void> {
    try {
      jwt.verify(token, config.jwt.secret);
    } catch (e) {
      if (
        e instanceof jwt.TokenExpiredError ||
        e instanceof jwt.JsonWebTokenError
      ) {
        throw new HttpException(401, 'Token expired');
      }
      throw new HttpException(401, 'Invalid token');
    }
  }

  async getTokenPayload(token: string): Promise<IUser> {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      if (typeof decoded !== 'string' && 'id' in decoded) {
        return this.userService.findOne({ did: decoded.id });
      }
    } catch (e) {
      if (
        e instanceof jwt.TokenExpiredError ||
        e instanceof jwt.JsonWebTokenError
      ) {
        throw new HttpException(401, 'Invalid token');
      }
    }
  }

  async generateMagicLink(email: string): Promise<void> {
    const emailTemplate = process.env.NODE_ENV === 'development' ? fs.readFileSync(
      path.join('./templates', 'login.html'),
      'utf8',
    ) : fs.readFileSync(
      path.join('/app/packages/server/templates', 'login.html'),
      'utf8',
    );
    const token = jwt.sign(
      { id: crypto.randomUUID(), email },
      config.jwt.magicLink.secret,
      {
        expiresIn: config.jwt.magicLink.expiry,
      },
    );
    
    // Check if user exists to determine redirect
    const user = await this.userService.findOne({ email });
    const redirect = user && user.organizations?.length > 0 ? '/studio' : '/studio/create';
    
    const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl : config.frontendUrl;
    const htmlContent = replacePlaceHolders(emailTemplate, {
      link: `${baseUrl}/auth/magic-link?token=${token}&email=${email}&redirect=${redirect}`,
    });
    
    if (!user) {
      await this.userService.create({ email, did: generateDID() });
    }
    
    await this.mailService.simpleSend({
      from: 'noreply@streameth.org',
      recipient: email,
      subject: 'Login to Streameth',
      html: htmlContent,
    });
  }
}