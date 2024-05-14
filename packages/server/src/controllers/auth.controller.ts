import { Controller, Route, Tags, SuccessResponse, Body, Post } from 'tsoa';
import AuthService from '@services/auth.service';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import { UserDto } from '@dtos/user/user.dto';
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
}
