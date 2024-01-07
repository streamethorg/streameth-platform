import StageService from '@services/stage.service';
import { SendApiResponse } from '@utils/api.response';
import { Request, Response, NextFunction } from 'express';

export default class StageController {
  private stageService = new StageService();
  createStage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stage = await this.stageService.create(req.body);
      return SendApiResponse(res, 201, 'stage created', stage);
    } catch (e) {
      next(e);
    }
  };

  editStage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stage = await this.stageService.update(req.params.id, req.body);
      return SendApiResponse(res, 200, 'stage updated', stage);
    } catch (e) {
      next(e);
    }
  };

  getStageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stage = await this.stageService.get(req.params.id);
      return SendApiResponse(res, 200, 'stage fetched', stage);
    } catch (e) {
      next(e);
    }
  };

  getAllStages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stages = await this.stageService.getAll();
      return SendApiResponse(res, 200, 'stages fetched', stages);
    } catch (e) {
      next(e);
    }
  };

  getAllStagesForEvent = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const stages = await this.stageService.findAllStagesForEvent(
        req.params.id,
      );
      return SendApiResponse(res, 200, 'stages fetched', stages);
    } catch (e) {
      next(e);
    }
  };

  deleteStage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stage = await this.stageService.deleteOne(req.params.id);
      return SendApiResponse(res, 200, 'deleted', stage);
    } catch (e) {
      next(e);
    }
  };
}
