import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';

import { VehicleService } from '@/vehicle/vehicle.service';
import { Vehicle } from '@/vehicle/vehicle.entity';
import { APPConfig } from '@/config/app.config';

export class ModuleTestUtil {
  public async getVehicleModule(): Promise<VehicleService> {
    const moduleRef = await Test.createTestingModule({
      providers: [VehicleService],
      imports: [
        TypeOrmModule.forRoot(APPConfig.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Vehicle]),
      ],
    }).compile();
    return moduleRef.get<VehicleService>(VehicleService);
  }

  public async tearDownConnection(): Promise<void> {
    await getConnection().close();
  }
}
