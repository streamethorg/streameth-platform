import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { IOrganization } from '@interfaces/organization.interface';
import Organization from '@models/organization.model';
import User from '@models/user.model';

export default class OrganizationService {
  private path: string;
  private controller: BaseController<IOrganization>;
  constructor() {
    this.path = 'organizations';
    this.controller = new BaseController<IOrganization>('db', Organization);
  }
  async create(data: IOrganization): Promise<IOrganization> {
    const findOrg = await this.controller.store.findOne(
      { name: data.name },
      this.path,
    );
    if (findOrg) throw new HttpException(409, 'Organization already exists');
    const createOrg = await this.controller.store.create(
      data.name,
      data,
      this.path,
    );
    await User.findOneAndUpdate(
      { walletAddress: data.walletAddress },
      { $addToSet: { organizations: createOrg._id } },
    );
    return createOrg;
  }
  async update(
    organizationId: string,
    organization: IOrganization,
  ): Promise<IOrganization> {
    return await this.controller.store.update(organizationId, organization);
  }

  async get(organizationId: string): Promise<IOrganization> {
    let id = '';
    const isObjectId = /[0-9a-f]{24}/i.test(organizationId);
    const isPathId = /organizations-[a-zA-Z0-9\-_]+/.test(organizationId);
    if (isObjectId) {
      id = organizationId;
    }
    if (isPathId) {
      id = organizationId.replace('-', '/');
    }
    if (!isObjectId && !isPathId) {
      return await this.controller.store.findOne({ slug: organizationId });
    }
    const findOrg = await this.controller.store.findById(id);
    if (!findOrg) throw new HttpException(404, 'Organization not found');
    return findOrg;
  }

  async getAll(): Promise<Array<IOrganization>> {
    return await this.controller.store.findAll({}, this.path);
  }

  async deleteOne(organizationId: string): Promise<void> {
    await this.get(organizationId);
    return await this.controller.store.delete(organizationId);
  }

  async updateOrganizationMembers(
    organizationId: string,
    walletAddress: string
  ) {
    await this.get(organizationId);
    let x = await User.findOneAndUpdate(
      { walletAddress: walletAddress },
      { $addToSet: { organizations: organizationId } },
    )
  }
}
