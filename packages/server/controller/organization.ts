import BaseController from './baseController'
import Organization, { IOrganization } from '../model/organization'

export default class OrganizationController {
  private controller: BaseController<IOrganization>

  constructor() {
    this.controller = new BaseController<IOrganization>('fs')
  }

  public async getOrganization(
    organizationId: IOrganization['id']
  ): Promise<Organization> {
    const organizationQuery = await Organization.getOrganizationPath(
      organizationId
    )
    const data = await this.controller.get(organizationQuery)
    return new Organization({ ...data })
  }

  public async createOrganization(
    organization: Omit<IOrganization, 'id'>
  ): Promise<Organization> {
    const org = new Organization({ ...organization })
    const organizationQuery = await Organization.getOrganizationPath(
      org.id
    )
    await this.controller.create(organizationQuery, org)
    return org
  }

  public async editOrganization(
    organization: IOrganization
  ): Promise<Organization> {
    await this.deleteOrganization(organization.id)
    return this.createOrganization(organization)
  }

  public async getAllOrganizations(): Promise<Organization[]> {
    const organizations: Organization[] = []
    const organizationQuery = await Organization.getOrganizationPath()
    const data = await this.controller.getAll(organizationQuery)
    for (const org of data) {
      organizations.push(new Organization({ ...org }))
    }
    return organizations
  }

  public async deleteOrganization(
    organizationId: IOrganization['id']
  ): Promise<void> {
    if (!organizationId) {
      throw new Error('Invalid eventId or organizationId')
    }

    const organization = await this.getOrganization(organizationId)
    if (!organization) {
      throw new Error('Event does not exist')
    }

    const organizationQuery = await Organization.getOrganizationPath(
      organizationId
    )
    this.controller.delete(organizationQuery)
  }
}
