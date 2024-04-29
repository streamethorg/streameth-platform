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
  Query,
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
   * @summary Get Event
   */
  @SuccessResponse('200')
  @Get('{eventId}')
  async getEventById(
    @Path() eventId: string,
  ): Promise<IStandardResponse<IEvent>> {
    const event = await this.eventService.get(eventId);
    return SendApiResponse('event fetched', event);
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

  /**
   * @summary Event importer
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Put('/import/{eventId}')
  async evenImporter(
    @Path() eventId: string,
    @Body() organizationId: OrgIdDto,
  ): Promise<IStandardResponse<void>> {
    await this.eventService.eventImport(eventId);
    return SendApiResponse('syncing..');
  }

  /**
   * @summary Get All Event
   */
  @SuccessResponse('200')
  @Get()
  async getAllEvents(
    @Query() organizationId?: string,
    @Query() unlisted?: boolean,
  ): Promise<IStandardResponse<Array<IEvent>>> {
    const query = {
      organizationId: organizationId,
      unlisted: unlisted,
    };
    const events = await this.eventService.getAll(query);
    return SendApiResponse('events fetched', events);
  }

  /**
   * @summary Delete Event
   */
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
