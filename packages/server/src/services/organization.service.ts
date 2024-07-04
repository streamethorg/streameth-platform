import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { IOrganization, ISocials } from '@interfaces/organization.interface';
import { IUser } from '@interfaces/user.interface';
import Organization from '@models/organization.model';
import User from '@models/user.model';
import { config } from '@config';
import { isEthereumAddress } from '@utils/util';
import privy from '@utils/privy';
import UserService from './user.service';

export default class OrganizationService {
  private path: string;
  private controller: BaseController<IOrganization>;
  private userService = new UserService();
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
    const wallets = [...config.wallets.trim().split(','), data.walletAddress];
    await User.updateMany(
      { walletAddress: { $in: wallets } },
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
    const walletAddresses = config.wallets.trim().split(',');
    const users = await User.find(
      {
        organizations: organizationId,
        walletAddress: { $nin: walletAddresses },
      },
      { did: 0 },
    );
    return users;
  }

  async addOrgMember(organizationId: string, address: string) {
    await this.get(organizationId);
    const isWalletAddress = isEthereumAddress(address);
    let walletAddress: string = '';
    if (isWalletAddress) walletAddress = address;
    if (!isWalletAddress) {
      let user = await privy.getUserByEmail(address);
      if (!user) {
        let newAccount = await privy.importUser({
          linkedAccounts: [
            //@ts-ignore
            {
              type: 'email',
              address: address,
            },
          ],
          createEmbeddedWallet: true,
        });
        walletAddress = newAccount.wallet.address;
        await this.userService.create({
          did: newAccount.id,
          walletAddress: newAccount.wallet.address,
        });
      } else walletAddress = user.wallet.address;
    }
    await User.findOneAndUpdate(
      { walletAddress: walletAddress },
      { $addToSet: { organizations: organizationId } },
    );
  }

  async deleteOrgMember(organizationId: string, walletAddress: string) {
    await this.get(organizationId);
    await User.findOneAndUpdate(
      { walletAddress: walletAddress },
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
