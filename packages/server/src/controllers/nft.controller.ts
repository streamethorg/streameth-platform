import { CreateNftCollectionDto } from '@dtos/nft/create-colletion.dto';
import { INftCollection } from '@interfaces/nft.collection.interface';
import CollectionService from '@services/nft.service';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';

@Tags('Collections')
@Route('collections')
export class NftCollectionRouter extends Controller {
  private collectionService = new CollectionService();

  /**
   *
   * @Summary Create nft collection
   */
  @SuccessResponse('201')
  @Post()
  async createNftCollection(
    @Body() body: CreateNftCollectionDto,
  ): Promise<IStandardResponse<INftCollection>> {
    const collection = await this.collectionService.create(body);
    return SendApiResponse('collection created', collection);
  }

  /**
   *
   * @Summary Get all nft collections
   */
  @SuccessResponse('200')
  @Get()
  async getAllCollections(): Promise<IStandardResponse<Array<INftCollection>>> {
    const collections = await this.collectionService.getAll();
    return SendApiResponse('collections fetched', collections);
  }

  /**
   *
   * @Summary Get Nft collection by id
   */
  @SuccessResponse('200')
  @Get('{collectionId}')
  async getNftCollectionById(
    @Path() collectionId: string,
  ): Promise<IStandardResponse<INftCollection>> {
    const collection = await this.collectionService.get(collectionId);
    return SendApiResponse('collection fetched', collection);
  }

  /**
   *
   * @Summary Get Nft collections by organization
   */
  @SuccessResponse('200')
  @Get('organization/{organizationId}')
  async getAllOrganizationNft(
    @Path() organizationId: string,
  ): Promise<IStandardResponse<Array<INftCollection>>> {
    const collections =
      await this.collectionService.findAllNftForOrganization(organizationId);
    return SendApiResponse('collections fetched', collections);
  }
}
