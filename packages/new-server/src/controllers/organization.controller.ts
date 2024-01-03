import OrganizationService from '@services/organization.service';
import { SendApiResponse } from '@utils/api.response';
import { Request, Response, NextFunction } from 'express';

export default class OrganizationController {
  private organizationService = new OrganizationService();

  createOrganization = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const org = await this.organizationService.create(req.body);
      return SendApiResponse(res, 201, 'organization created', org);
    } catch (e) {
      next(e);
    }
  };

  editOrganization = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const org = await this.organizationService.update(
        req.params.id,
        req.body,
      );
      return SendApiResponse(res, 200, 'organization updated', org);
    } catch (e) {
      next(e);
    }
  };

  getOrganizationById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const org = await this.organizationService.get(req.params.id);
      return SendApiResponse(res, 200, 'organization fetched', org);
    } catch (e) {
      next(e);
    }
  };

  getAllOrganizations = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const orgs = await this.organizationService.getAll();
      return SendApiResponse(res, 200, 'organizations fetched', orgs);
    } catch (e) {
      next(e);
    }
  };

  deleteOrganization = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const org = await this.organizationService.deleteOne(req.params.id);
      return SendApiResponse(res, 200, 'deleted', org);
    } catch (e) {
      next(e);
    }
  };
}
