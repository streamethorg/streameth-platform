import SpeakerController from '@controllers/speaker.controller';
import { Router } from 'express';

class SpeakerRoute {
  path = '/speakers';
  private speakerController = new SpeakerController();
  readonly router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .post(`${this.path}`, this.speakerController.createSpeaker)
      .get(`${this.path}/:id`, this.speakerController.getSpeaker)
      .get(
        `${this.path}/event/:id`,
        this.speakerController.getAllSpeakersForEvent,
      );
  }
}

export default SpeakerRoute;
