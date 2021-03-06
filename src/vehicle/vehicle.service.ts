import { Injectable } from '@nestjs/common';
import { Connection, getConnection } from 'typeorm';

import { BaseService } from '@common/base.service';

import { ListResult, PaginationPayload } from '@common/helpers.dto';

import { VehicleListDTO } from '@/vehicle/vehicle.dto';
import { Vehicle } from '@/vehicle/vehicle.entity';

@Injectable()
export class VehicleService extends BaseService {
  private readonly connection: Connection;

  constructor() {
    super();
    this.connection = getConnection();
  }

  public async list(
    payload: PaginationPayload,
  ): Promise<ListResult<VehicleListDTO[]>> {
    const vehicles = await this.connection.manager.find(Vehicle);
    return this.listItems(vehicles, payload, vehicles.length);
  }
}
