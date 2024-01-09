import SpeakerService from '@services/speaker.service';
import { SendApiResponse } from '@utils/api.response';
import { Response, Request, NextFunction } from 'express';

export default class SpeakerController {
  private speakerService = new SpeakerService();

  createSpeaker = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createSpeaker = await this.speakerService.create(req.body);
      return SendApiResponse(res, 201, 'speaker created', createSpeaker);
    } catch (e) {
      next(e);
    }
  };

  getSpeaker = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const speaker = await this.speakerService.get(req.params.id);
      return SendApiResponse(res, 200, 'speaker fetched', speaker);
    } catch (e) {
      next(e);
    }
  };

  getAllSpeakersForEvent = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const speakers = await this.speakerService.findAllSpeakersForEvent(
        req.params.id,
      );
      return SendApiResponse(res, 200, 'speakers fetched', speakers);
    } catch (e) {
      next(e);
    }
  };
}
