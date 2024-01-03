import EventController from '@controllers/event.controller';
import { Router } from 'express';

class EventRoute {
  path = '/events';
  private eventController = new EventController();
  readonly router = Router();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .post(`${this.path}`, this.eventController.createEvent)
      .get(`${this.path}`, this.eventController.getAllEvents)
      .get(`${this.path}/:id`, this.eventController.getEventById)
      .get(
        `${this.path}/organization/:id`,
        this.eventController.getAllEventsForOrganization,
      )
      .put(`${this.path}/:id`, this.eventController.editEvent)
      .delete(`${this.path}/:id`, this.eventController.deleteEvent);
  }
}

export default EventRoute;
