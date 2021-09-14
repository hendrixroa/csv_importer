import { EntityRepository } from 'typeorm';

import { Vehicle } from '@modules/vehicle/vehicle.entity';
import { BaseRepository, BaseSelectOptions } from '@common/base.repository';

export interface VehicleSelectOptions extends BaseSelectOptions {
  search?: string;
}

@EntityRepository(Vehicle)
export class VehicleRepository extends BaseRepository<Vehicle> {
  public async select(
    options: VehicleSelectOptions = {},
  ): Promise<{ count: number; items: Vehicle[]; page: number; pages: number }> {
    const qb = this.createQueryBuilder('vehicle');

    if (options.search) {
    }

    qb.orderBy('vehicle.createDate', 'DESC');
    return this.defaultSelect(qb, options);
  }
}
