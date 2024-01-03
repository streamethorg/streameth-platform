import EventService from '@services/event.service';
import { SendApiResponse } from '@utils/api.response';
import { Request, Response, NextFunction } from 'express';

export default class EventController {
  private eventService = new EventService();
  createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = await this.eventService.create(req.body);
      return SendApiResponse(res, 201, 'event created', event);
    } catch (e) {
      next(e);
    }
  };

  editEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = await this.eventService.update(req.params.id, req.body);
      return SendApiResponse(res, 200, 'event updated', event);
    } catch (e) {
      next(e);
    }
  };

  getEventById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = await this.eventService.get(req.params.id);
      return SendApiResponse(res, 200, 'event fetched', event);
    } catch (e) {
      next(e);
    }
  };

  getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const events = await this.eventService.getAll();
      return SendApiResponse(res, 200, 'events fetched', events);
    } catch (e) {
      next(e);
    }
  };

  getAllEventsForOrganization = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const events = await this.eventService.findAllOwnedEvents(req.params.id);
      return SendApiResponse(res, 200, 'events fetched', events);
    } catch (e) {
      next(e);
    }
  };

  deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = await this.eventService.deleteOne(req.params.id);
      return SendApiResponse(res, 200, 'deleted', event);
    } catch (e) {
      next(e);
    }
  };
}
