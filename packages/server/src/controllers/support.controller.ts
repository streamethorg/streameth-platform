import { CreateSupportTicketDto } from '@dtos/support/create-ticket.dto';
import { ISupport } from '@interfaces/support.interface';
import SupportService from '@services/support.service';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

@Tags('Support')
@Route('Tickets')
export class SupportController extends Controller {
  private supportService = new SupportService();

  /**
   * @summary Creates support ticket
   */
  @Security('jwt')
  @SuccessResponse('201')
  @Post('')
  async createTicket(
    @Body() body: CreateSupportTicketDto,
  ): Promise<IStandardResponse<ISupport>> {
    const ticket = await this.supportService.create(body);
    return SendApiResponse('ticket created', ticket);
  }

  /**
   * @summary Get all support tickets
   */
  @SuccessResponse('200')
  @Get()
  async getAllTickets(): Promise<IStandardResponse<ISupport[]>> {
    const tickets = await this.supportService.getAll();
    return SendApiResponse('tickets fetched', tickets);
  }
}
