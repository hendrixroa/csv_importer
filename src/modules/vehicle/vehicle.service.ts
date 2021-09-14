import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { difference } from 'lodash';

import { BaseService } from '@common/base.service';

import {
  ListResult,
  SingleItemIDParam,
  SingleResult,
} from '@common/helpers.dto';
import { PaginationPayload } from '@common/helpers.dto';

import { VehicleListDTO } from '@modules/vehicle/vehicle.dto';
import { VehicleRepository } from '@modules/vehicle/vehicle.repository';
import { Vehicle } from '@modules/vehicle/vehicle.entity';

@Injectable()
export class VehicleService extends BaseService {
  private readonly NAME_FOR_RESULT = 'Vehicle';
  constructor(
    @InjectRepository(VehicleRepository)
    private readonly VehicleRepository: VehicleRepository,
  ) {
    super();
  }

  public async list(
    payload: PaginationPayload,
  ): Promise<ListResult<VehicleListDTO[]>> {
    const { items = [], count } = await this.VehicleRepository.select({
      count: true,
      limit: payload.limit,
      page: payload.page,
      search: payload.search,
    });
    return this.listItems(items, payload, count);
  }
}
