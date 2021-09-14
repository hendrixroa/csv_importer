import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '@common/common.module';

import { ImporterService } from '@modules/importer/importer.service';
import { ImporterController } from '@modules/importer/importer.controller';
import { APPConfig } from '@/config/app.config';
import { Vehicle } from '@modules/vehicle/vehicle.entity';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forRoot(APPConfig.getTypeOrmConfig()),
    TypeOrmModule.forFeature([Vehicle]),
  ],
  controllers: [ImporterController],
  providers: [ImporterService],
  exports: [ImporterService],
})
export class ImporterModule {}
