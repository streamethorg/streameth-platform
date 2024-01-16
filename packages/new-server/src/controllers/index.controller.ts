import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import { Controller, Get, Route, Tags } from 'tsoa';
@Tags('Index')
@Route('')
export class IndexController extends Controller {
  @Get()
  async index(): Promise<IStandardResponse<string>> {
    return SendApiResponse('OK');
  }
}
