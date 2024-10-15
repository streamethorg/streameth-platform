import { IAnimation } from '@interfaces/animation.interface';
import AnimationService from '@services/animation.service';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import { Body, Controller, Post, Route, SuccessResponse, Tags } from 'tsoa';

@Tags('Animation')
@Route('animation')
export class AnimationController extends Controller {
  private animationService = new AnimationService();

  @SuccessResponse('201')
  @Post()
  async createAnimation(
    @Body() body: IAnimation,
  ): Promise<IStandardResponse<IAnimation>> {
    const animation = await this.animationService.create(body);
    return SendApiResponse('animation created', animation);
  }
}
