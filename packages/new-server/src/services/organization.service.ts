import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { IOrganization } from '@interfaces/organization.interface';
import Organization from '@models/organization.model';

export default class OrganizationService {
  private path: string;
  private controller: BaseController<IOrganization>;
  constructor() {
    this.path = 'organizations';
    this.controller = new BaseController<IOrganization>('fs', Organization);
  }
  async create(data: IOrganization): Promise<IOrganization> {
    const findOrg = await this.controller.store.findOne(
      { name: data.name },
      this.path,
    );
    if (findOrg) throw new HttpException(409, 'Organization already exists');
    return this.controller.store.create(data.name, data, this.path);
  }
  async update(
    organizationId: string,
    organization: IOrganization,
  ): Promise<IOrganization> {
    return await this.controller.store.update(
      organizationId,
      organization,
      this.path,
    );
  }

  async get(organizationId: string): Promise<IOrganization> {
    const findOrg = await this.controller.store.findById(
      organizationId,
      this.path,
    );
    if (!findOrg) throw new HttpException(404, 'Organization not found');
    return findOrg;
  }

  async getAll(): Promise<Array<IOrganization>> {
    return await this.controller.store.findAll({}, this.path);
  }

  async deleteOne(organizationId: string): Promise<void> {
    await this.get(organizationId);
    return await this.controller.store.delete(organizationId, this.path);
  }
}
