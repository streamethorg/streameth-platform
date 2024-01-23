import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import { Controller, Get, Route, Tags, Body, Post } from 'tsoa';
import startCreatingSummary from '../../../tools/ai/src/main';

@Tags('Index')
@Route('')
export class IndexController extends Controller {
  @Get()
  async index(): Promise<IStandardResponse<string>> {
    return SendApiResponse('OK');
  }
  @Post('/webhook')
  async webhook(@Body() payload: any): Promise<IStandardResponse<string>> {
    startCreatingSummary(payload.payload.id).catch((err) => {
      console.log(err);
      return SendApiResponse('Error', 0, 500);
    });
    return SendApiResponse('OK');
  }
}
