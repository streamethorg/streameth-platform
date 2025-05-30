import { config } from '@config';
import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { IOrganization, IOrganizationUpdate, ISocials, SubscriptionTier, SubscriptionStatus } from '@interfaces/organization.interface';
import { IUser } from '@interfaces/user.interface';
import Organization from '@models/organization.model';
import User from '@models/user.model';
import { generateId } from '@utils/util';

export default class OrganizationService {
  private path: string;
  private controller: BaseController<IOrganization>;
  constructor() {
    this.path = 'organizations';
    this.controller = new BaseController<IOrganization>('db', Organization);
  }

  private generateInvitationCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  async create(data: IOrganization): Promise<IOrganization> {
    const findOrg = await this.controller.store.findOne(
      { slug: generateId(data.name) },
      this.path,
    );
    if (findOrg) throw new HttpException(409, 'Organization already exists');

    // Set default payment status and expiration date for new organizations
    // Also include free tier defaults
    const orgData = {
      ...data,
      // We no longer track stages, this is kept as comment for reference
      // paidStages: 0,
      // currentStages: 0,
      invitationCode: this.generateInvitationCode(),
      
      // Free tier defaults
      subscriptionTier: 'free' as SubscriptionTier,
      subscriptionStatus: 'active' as SubscriptionStatus,
      maxVideoLibrarySize: 5,
      maxSeats: 1,
      isLivestreamingEnabled: false,
      isMultistreamEnabled: false,
      isCustomChannelEnabled: false,
      hasPrioritySupport: false,
    };

    const createOrg = await this.controller.store.create(
      orgData.name,
      orgData,
      this.path,
    );

    const emails = [...config.wallets.trim().split(','), data.address];
    await User.updateMany(
      { email: { $in: emails } },
      { $addToSet: { organizations: createOrg._id } },
    );
    return createOrg;
  }

  async activateFreeTier(organizationId: string): Promise<IOrganization> {
    const org = await this.get(organizationId);
    
    if (!org) {
      throw new HttpException(404, 'Organization not found');
    }
    
    // Set free tier values without affecting one-off subscription data
    const updateData = {
      subscriptionTier: 'free' as SubscriptionTier,
      subscriptionStatus: 'active' as SubscriptionStatus,
      maxVideoLibrarySize: 5,
      maxSeats: 1,
      isLivestreamingEnabled: false, // Free tier has no livestreaming
      isMultistreamEnabled: false,
      isCustomChannelEnabled: false,
      hasPrioritySupport: false
    };
    
    // Update using the Organization model directly
    const updatedOrg = await Organization.findByIdAndUpdate(
      organizationId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedOrg) {
      throw new HttpException(404, 'Failed to update organization');
    }

    return updatedOrg;
  }

  async joinOrganization(invitationCode: string, userEmail: string): Promise<IOrganization> {
    const organization = await this.controller.store.findOne({ invitationCode });
    if (!organization) {
      throw new HttpException(404, 'Invalid invitation code');
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    if (user.organizations?.some(orgId => orgId.toString() === organization._id.toString())) {
      throw new HttpException(409, 'User is already a member of this organization');
    }

    await User.findOneAndUpdate(
      { email: userEmail },
      { $addToSet: { organizations: organization._id } }
    );

    return organization;
  }

  async update(
    organizationId: string,
    organizationUpdate: IOrganizationUpdate,
  ): Promise<IOrganization> {
    // Get current organization to preserve required fields
    const currentOrg = await this.get(organizationId);
    if (!currentOrg) {
      throw new HttpException(404, 'Organization not found');
    }

    // We no longer track currentStages, this comment stays here for historical reference

    // Update using the Organization model directly
    const updatedOrg = await Organization.findByIdAndUpdate(
      organizationId,
      { $set: organizationUpdate },
      { new: true }
    );

    if (!updatedOrg) {
      throw new HttpException(404, 'Failed to update organization');
    }

    return updatedOrg;
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
    await this.get(organizationId);
    await User.findOneAndUpdate(
      { email },
      { $addToSet: { organizations: organizationId } },
    );
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
