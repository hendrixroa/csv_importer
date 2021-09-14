import {
  IsDefined,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

import { APPConfig } from '@config/app.config';

export class APIConfig extends APPConfig {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  APP = 'api';

  @IsNumberString()
  @IsDefined()
  PORT = 3000;
}
