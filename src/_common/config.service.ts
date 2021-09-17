import { Injectable } from '@nestjs/common';

import { ValidatorService } from '@common/validator.service';
import { ClassParserService } from '@common/class.parser.service';

@Injectable()
export class ConfigService {
  private validatorService: ValidatorService;
  private classParserService: ClassParserService;

  constructor() {
    this.validatorService = new ValidatorService();
    this.classParserService = new ClassParserService();
  }

  public loadConfig<T>(instance: new () => T): T {
    const config = this.classParserService.toClass(
      instance,
      JSON.parse(JSON.stringify(process.env)),
    );
    const invalid = this.validatorService.validate(config, {
      throwOnError: false,
    });
    if (invalid) {
      throw new Error(invalid);
    }
    return config;
  }
}
