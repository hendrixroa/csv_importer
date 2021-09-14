import { Injectable } from '@nestjs/common';

import { APPConfig } from '@config/app.config';
import { ImporterPayload } from '@modules/importer/importer.dto';

import { BaseService } from '@common/base.service';

@Injectable()
export class ImporterService extends BaseService {
  constructor() {
    super();
  }

  public async processFiles(files: ImporterPayload[]): Promise<string> {
    try {
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
