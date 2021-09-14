import {
  IsArray,
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as ormconfig from '@config/ormconfig';

export class APPConfig {
  @IsDefined()
  @IsString()
  @IsIn(['development', 'production', 'test'])
  NODE_ENV = 'development';

  @IsOptional()
  @IsArray()
  APP_LOG_LEVEL = ['info'];

  public static getTypeOrmConfig(): TypeOrmModuleOptions {
    return ormconfig[0];
  }
}
