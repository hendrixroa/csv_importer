import { Module } from '@nestjs/common';

import { CommonModule } from '@common/common.module';

import { ImporterService } from '@modules/importer/importer.service';
import { ImporterController } from '@modules/importer/importer.controller';

@Module({
  imports: [CommonModule],
  controllers: [ImporterController],
  providers: [ImporterService],
  exports: [ImporterService],
})
export class ImporterModule {}
