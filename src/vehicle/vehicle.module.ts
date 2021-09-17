import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { APPConfig } from '@config/app.config';
import { CommonModule } from '@common/common.module';
import { Vehicle } from '@/vehicle/vehicle.entity';
import { VehicleService } from '@/vehicle/vehicle.service';
import { VehicleController } from '@/vehicle/vehicle.controller';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forRoot(APPConfig.getTypeOrmConfig()),
    TypeOrmModule.forFeature([Vehicle]),
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}
