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
import { UserDto } from '@dtos/user.dto';
import { AuthDto } from '@dtos/auth.dto';
import { IUser } from '@interfaces/user.interface';
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
    return SendApiResponse('success', status);
  }
}
