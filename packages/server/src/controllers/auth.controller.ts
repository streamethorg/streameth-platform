import { UserDto } from '@dtos/user/user.dto';
import { IUser } from '@interfaces/user.interface';
import AuthService from '@services/auth.service';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';

@Tags('Auth')
@Route('auth')
export class AuthController extends Controller {
  private authService = new AuthService();

  /**
   * @summary Login
   */
  @SuccessResponse('201')
  @Post('login')
  async login(
    @Body() body: UserDto,
  ): Promise<IStandardResponse<{ user: IUser; token: string }>> {
    const user = await this.authService.login(body);
    return SendApiResponse('logged in', user);
  }

  /**
   * @summary Verify auth token
   */
  @SuccessResponse('201')
  @Post('/verify-token')
  async verifyToken(@Body() body: UserDto): Promise<IStandardResponse<void>> {
    await this.authService.verifyToken(body.token);
    return SendApiResponse('Success');
  }

  /**
   * @summary Get token
   */
  @SuccessResponse('201')
  @Get('/token')
  async getTokenPayload(
    @Header('Authorization') token: string,
  ): Promise<IStandardResponse<IUser>> {
    token = token.split('Bearer ')[1];
    const payload = await this.authService.getTokenPayload(token);
    return SendApiResponse('Success', payload);
  }
}
