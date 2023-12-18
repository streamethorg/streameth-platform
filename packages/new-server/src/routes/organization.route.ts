import { Router } from 'express';
import OrganizationController from '@controllers/organization.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateOrganizationDto } from '@dtos/organization.dto';

class OrganizationRoute {
  path = '/organizations';
  private organizationController = new OrganizationController();
  readonly router = Router();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .post(
        `${this.path}`,
        validationMiddleware(CreateOrganizationDto, 'body'),
        this.organizationController.createOrganization,
      )
      .get(`${this.path}`, this.organizationController.getAllOrganizations)
      .get(`${this.path}/:id`, this.organizationController.getOrganizationById)
      .put(`${this.path}/:id`, this.organizationController.editOrganization)
      .delete(
        `${this.path}/:id`,
        this.organizationController.deleteOrganization,
      );
  }
}

export default OrganizationRoute;
