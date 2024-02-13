import {
  Controller,
  Get,
  Route,
  Tags,
  SuccessResponse,
  Request,
  Body,
  Post,
} from 'tsoa';
import * as express from 'express';
import AuthService from '@services/auth.service';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import { UserDto } from '@dtos/user/user.dto';
import { AuthDto } from '@dtos/auth/auth.dto';
import { IUser } from '@interfaces/user.interface';
import validateOAuth from '@utils/validateOAuth';

@Tags('Auth')
@Route('auth')
export class AuthController extends Controller {
  private authService = new AuthService();

  @SuccessResponse('201')
  @Post('login')
  async login(
    @Body() body: UserDto,
  ): Promise<IStandardResponse<{ user: IUser; token: string }>> {
    const user = await this.authService.login(body);
    return SendApiResponse('logged in', user);
  }

  @SuccessResponse('200')
  @Get('nonce/generate')
  async generateNonce(
    @Request() req: express.Request,
  ): Promise<IStandardResponse<string>> {
    const nonce = await this.authService.generateNonce();
    return SendApiResponse('nonce generated', nonce.nonce);
  }

  @SuccessResponse('201')
  @Post('/verify-token')
  async verifyToken(
    @Body() token: AuthDto,
  ): Promise<IStandardResponse<boolean>> {
    const status = await this.authService.verifyToken(token);
    return SendApiResponse('Success', status);
  }

  @SuccessResponse('202')
  @Get('oauth2')
  async loginYoutube(
    @Request() req: express.Request,
  ): Promise<IStandardResponse<string>> {
    try {
      const url = await validateOAuth();

      return SendApiResponse('Success', url);
    } catch (err) {
      console.error(err);

      return SendApiResponse(err.toString(), null, '500');
    }
  }

  @SuccessResponse('200')
  @Get('/google/callback')
  async googleCallback(
    @Request() req: express.Request,
  ): Promise<IStandardResponse<string>> {
    try {
      console.log(req);

      return SendApiResponse('Success');
    } catch (err) {
      console.error(err);

      return SendApiResponse(err.toString(), null, '500');
    }
  }
}
