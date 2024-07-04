import { CreateSpeakerDto } from '@dtos/speaker/create-speaker.dto';
import { ISpeaker } from '@interfaces/speaker.interface';
import SpeakerService from '@services/speaker.service';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
  SuccessResponse,
  Tags,
  Security,
} from 'tsoa';

@Tags('Speaker')
@Route('speakers')
export class SpeakerController extends Controller {
  private speakerService = new SpeakerService();

  @Security('jwt', ['org'])
  @SuccessResponse('201')
  @Post()
  async createSpeaker(
    @Body() body: CreateSpeakerDto
  ): Promise<IStandardResponse<ISpeaker>> {
    const createSpeaker = await this.speakerService.create(body);
    return SendApiResponse('speaker created', createSpeaker);
  }

  @SuccessResponse('200')
  @Get('{speakerId}')
  async getSpeaker(
    @Path() speakerId: string
  ): Promise<IStandardResponse<ISpeaker>> {
    const speaker = await this.speakerService.get(speakerId);
    return SendApiResponse('speaker fetched', speaker);
  }

  @SuccessResponse('200')
  @Get('event/{eventId}')
  async getAllSpeakersForEvent(
    eventId: string
  ): Promise<IStandardResponse<Array<ISpeaker>>> {
    const speakers = await this.speakerService.findAllSpeakersForEvent(eventId);
    return SendApiResponse('speakers fetched', speakers);
  }
}
