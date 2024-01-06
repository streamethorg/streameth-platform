import SessionController from '@controllers/session.controller';
import { Router } from 'express';

class SessionRoute {
  path = '/sessions';
  private sessionController = new SessionController();
  readonly router = Router();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .post(`${this.path}`, this.sessionController.createSession)
      .get(`${this.path}`, this.sessionController.getAllSessions)
      .get(`${this.path}/:id`, this.sessionController.getSessionById)

      .put(`${this.path}/:id`, this.sessionController.editSession);
  }
}

export default SessionRoute;
