import { IEvent } from '../interfaces/event.interface';
import EventService from '@services/event.service';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import {
  Route,
  Get,
  Controller,
  Post,
  Put,
  Body,
  SuccessResponse,
  Path,
  Delete,
  Tags,
  Security,
} from 'tsoa';
import { CreateEventDto } from '@dtos/event/create-event.dto';
import { UpdateEventDto } from '@dtos/event/update-event.dto';
import { OrgIdDto } from '@dtos/organization/orgid.dto';
@Tags('Event')
@Route('events')
export class EventController extends Controller {
  private eventService = new EventService();

  /**
   * @summary Creates Event
   */
  @Security('jwt', ['org'])
  @SuccessResponse('201')
  @Post('')
  async createEvent(
    @Body() body: CreateEventDto,
  ): Promise<IStandardResponse<IEvent>> {
    const event = await this.eventService.create(body);
    return SendApiResponse('event created', event);
  }

  /**
   * @summary Update Event
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Put('{eventId}')
  async editEvent(
    @Path() eventId: string,
    @Body() body: UpdateEventDto,
  ): Promise<IStandardResponse<IEvent>> {
    const event = await this.eventService.update(eventId, body);
    return SendApiResponse('event udpated', event);
  }

  @SuccessResponse('200')
  @Get('{eventId}')
  async getEventById(
    @Path() eventId: string,
  ): Promise<IStandardResponse<IEvent>> {
    const event = await this.eventService.get(eventId);
    return SendApiResponse('event fetched', event);
  }

  @SuccessResponse('200')
  @Get()
  async getAllEvents(): Promise<IStandardResponse<Array<IEvent>>> {
    const events = await this.eventService.getAll();
    return SendApiResponse('events fetched', events);
  }

  @SuccessResponse('200')
  @Get('organization/{organizationId}')
  async getAllEventsForOrganization(
    @Path() organizationId: string,
  ): Promise<IStandardResponse<Array<IEvent>>> {
    const events = await this.eventService.findAllOwnedEvents(organizationId);
    return SendApiResponse('events fetched', events);
  }

  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Delete('{eventId}')
  async deleteEvent(
    @Path() eventId: string,
    @Body() organizationId: OrgIdDto,
  ): Promise<IStandardResponse<void>> {
    await this.eventService.deleteOne(eventId);
    return SendApiResponse('deleted');
  }
}
