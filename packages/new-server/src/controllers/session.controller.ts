import SessionServcie from '@services/session.service';
import { SendApiResponse } from '@utils/api.response';
import { Request, Response, NextFunction } from 'express';

export default class SessionController {
  private sessionService = new SessionServcie();

  createSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await this.sessionService.create(req.body);
      return SendApiResponse(res, 201, 'session created', session);
    } catch (e) {
      next(e);
    }
  };

  editSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await this.sessionService.update(req.params.id, req.body);
      return SendApiResponse(res, 200, 'session updated', session);
    } catch (e) {
      next(e);
    }
  };

  getSessionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await this.sessionService.get(req.params.id);
      return SendApiResponse(res, 200, 'session fetched', session);
    } catch (e) {
      next(e);
    }
  };

  getAllSessions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessions = await this.sessionService.getAll();
      return SendApiResponse(res, 200, 'sessions fetched', sessions);
    } catch (e) {
      next(e);
    }
  };
}
