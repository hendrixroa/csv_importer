import { LogService } from '@common/log.service';
import { ValidatorService } from '@common/validator.service';
import { ErrorService } from '@common/error.service';
import { PaginationPayload } from '@common/helpers.dto';
import { StringUtil } from '@common/string.util';

export class ModelMetaResponse {
  count: number;
  limit: number;
  page: number;
  pages: number;
}

export class MetaParam {
  payload?: PaginationPayload;
}

export class BaseService {
  private readonly limitItem = 20;
  private readonly pageItem = 1;
  protected logService: LogService;
  protected validatorService: ValidatorService;
  protected errorService: ErrorService;

  constructor() {
    this.logService = new LogService();
    this.errorService = new ErrorService();
    this.validatorService = new ValidatorService();
  }

  private mapItemsToList(items: any) {
    return items.map((item) => {
      return {
        ...item.getItemList(),
      };
    });
  }

  private getMetaResponse(count: number, param: MetaParam): ModelMetaResponse {
    const limit = param.payload.limit || this.limitItem;
    const page = param.payload.page || this.pageItem;
    const pages = Math.floor(count / limit);
    return {
      count,
      limit: Number(limit),
      page: Number(page),
      pages: pages === 0 ? 1 : pages,
    };
  }

  protected listMappedItems(
    items: any[],
    payload: PaginationPayload,
    count: number,
  ): {
    items: any[];
    meta: {
      count: number;
      limit: number;
      page: number;
      pages: number;
    };
  } {
    const itemsMapped = this.mapItemsToList(items);
    return {
      items: itemsMapped,
      meta: this.getMetaResponse(count, {
        payload,
      }),
    };
  }

  protected listItems(
    items: any[],
    payload?: PaginationPayload,
    count?: number,
  ): { items: any[]; meta: ModelMetaResponse } {
    return {
      items,
      meta: this.getMetaResponse(count || items.length, {
        payload,
      }),
    };
  }

  protected getItem(item: any | unknown): { item: any } {
    return {
      item: {
        ...item.getSingleItem(),
      },
    };
  }
}
