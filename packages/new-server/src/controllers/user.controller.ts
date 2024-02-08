import { IUser } from '@interfaces/user.interface';
import UserService from '@services/user.service';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import {
  Controller,
  Get,
  Path,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

@Tags('User')
@Route('users')
export class UserController extends Controller {
  private userService = new UserService();

  @Security('jwt')
  @SuccessResponse('200')
  @Get('{walletAddress}')
  async getUserById(
    @Path() walletAddress: string,
  ): Promise<IStandardResponse<IUser>> {
    const user = await this.userService.get(walletAddress);
    return SendApiResponse('user fetched', user);
  }
}
