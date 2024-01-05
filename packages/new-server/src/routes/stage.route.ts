import StageController from '@controllers/stage.controller';
import { Router } from 'express';

class StageRoute {
  path = '/stages';
  private stageController = new StageController();
  readonly router = Router();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .post(`${this.path}`, this.stageController.createStage)
      .get(`${this.path}`, this.stageController.getAllStages)
      .get(`${this.path}/:id`, this.stageController.getStageById)
      .get(`${this.path}/event/:id`, this.stageController.getAllStagesForEvent)
      .put(`${this.path}/:id`, this.stageController.editStage)
      .delete(`${this.path}/:id`, this.stageController.deleteStage);
  }
}

export default StageRoute;
