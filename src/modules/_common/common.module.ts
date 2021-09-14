import { Module } from '@nestjs/common';

import { ErrorService } from '@common/error.service';
import { LogService } from '@common/log.service';
import { BaseService } from '@common/base.service';
import { ValidatorService } from '@common/validator.service';
import { ClassParserService } from '@common/class.parser.service';
import { ConfigService } from '@common/config.service';

@Module({
  providers: [
    ErrorService,
    ValidatorService,
    LogService,
    BaseService,
    ClassParserService,
    ConfigService,
  ],
  exports: [
    ErrorService,
    ValidatorService,
    LogService,
    BaseService,
    ClassParserService,
    ConfigService,
  ],
})
export class CommonModule {}
