import { config } from '@config';
import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { IOrganization, ISocials } from '@interfaces/organization.interface';
import { IUser } from '@interfaces/user.interface';
import Organization from '@models/organization.model';
import User from '@models/user.model';
import { generateDID, generateId, replacePlaceHolders } from '@utils/util';
import UserService from './user.service';
import EmailService from '@utils/mail.service';
import { readFileSync } from 'fs';
import path from 'path';

export default class OrganizationService {
  private path: string;
  private controller: BaseController<IOrganization>;
  private userService = new UserService();
  private mailService = new EmailService();

  constructor() {
    this.path = 'organizations';
    this.controller = new BaseController<IOrganization>('db', Organization);
  }
  async create(data: IOrganization): Promise<IOrganization> {
    const findOrg = await this.controller.store.findOne(
      { slug: generateId(data.name) },
      this.path,
    );
    if (findOrg) throw new HttpException(409, 'Organization already exists');
    const createOrg = await this.controller.store.create(
      data.name,
      data,
      this.path,
    );
    const emails = [...config.wallets.trim().split(','), data.address];
    await User.updateMany(
      { email: { $in: emails } },
      { $addToSet: { organizations: createOrg._id } },
    );
    return createOrg;
  }
  async update(
    organizationId: string,
    organization: IOrganization,
  ): Promise<IOrganization> {
    return await this.controller.store.update(
      organizationId,
      organization,
      organization.name,
    );
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
    const findOrg = await this.controller.store.findById(id, {
      'socials.accessToken': 0,
      'socials.refreshToken': 0,
      'socials.expireTime': 0,
    });
    if (!findOrg) throw new HttpException(404, 'Organization not found');
    return findOrg;
  }

  async getAll(): Promise<Array<IOrganization>> {
    return await this.controller.store.findAll(
      {},
      {
        'socials.accessToken': 0,
        'socials.refreshToken': 0,
        'socials.expireTime': 0,
      },
    );
  }

  async deleteOne(organizationId: string): Promise<void> {
    await this.get(organizationId);
    return await this.controller.store.delete(organizationId);
  }

  async getOrgMembers(organizationId: string): Promise<Array<IUser>> {
    const emails = config.wallets.trim().split(',');
    const users = await User.find(
      {
        organizations: organizationId,
        email: { $nin: emails },
      },
      { did: 0 },
    );
    return users;
  }

  async addOrgMember(organizationId: string, email: string) {
    const organization = await this.get(organizationId);

    // Find user, if it does not exist it creates a new one
    try {
      await this.userService.get(email);
    } catch {
      await this.userService.create({
        email,
        did: generateDID(),
      });
    }

    await User.findOneAndUpdate(
      { email },
      { $addToSet: { organizations: organizationId } },
    );

    const emailTemplate = readFileSync(
      path.join('./templates', 'invite.html'),
      'utf8',
    );

    const htmlContent = replacePlaceHolders(emailTemplate, {
      organization_name: organization.name,
    });

    await this.mailService.simpleSend({
      from: 'noreply@streameth.org',
      recipient: email,
      subject: 'Invitation to StreamETH',
      html: htmlContent,
    });
  }

  async deleteOrgMember(organizationId: string, email: string) {
    await this.get(organizationId);
    await User.findOneAndUpdate(
      { email },
      { $pull: { organizations: organizationId } },
    );
  }

  async addOrgSocial(organizationId: string, data: ISocials) {
    const org = await this.get(organizationId);

    const existingSocial = org.socials.find(
      (social) =>
        social.channelId === data.channelId && social.type === data.type,
    );

    if (existingSocial) {
      // Update the social with new data
      await Organization.findOneAndUpdate(
        { _id: organizationId, 'socials.channelId': data.channelId },
        await Organization.findOneAndUpdate(
          {
            _id: organizationId,
            'socials.channelId': data.channelId,
            'socials.type': data.type,
          },
          {
            $set: {
              'socials.$.accessToken': data.accessToken,
              'socials.$.refreshToken': data.refreshToken,
              'socials.$.expireTime': data.expireTime,
            },
          },
          { upsert: true },
        ),
      );
    } else {
      // Add the new social entry
      await Organization.findOneAndUpdate(
        { _id: organizationId },
        {
          $addToSet: {
            socials: {
              type: data.type,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              expireTime: data.expireTime,
              name: data.name,
              thumbnail: data.thumbnail,
              channelId: data.channelId,
            },
          },
        },
      );
    }
  }

  async deleteOrgSocial(organizationId: string, destinationId: string) {
    const organization = await this.get(organizationId);
    if (!organization) {
      throw new Error('Organization not found');
    }
    await Organization.updateOne(
      { _id: organizationId },
      { $pull: { socials: { _id: destinationId } } },
    );
  }
}
