import { NextFunction, Request, Response } from 'express';
import startCreatingSummary from '../../../tools/ai/src/main';

class IndexController {
  public webhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      await startCreatingSummary(payload.payload.id);

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
