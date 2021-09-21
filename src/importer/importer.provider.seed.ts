import { getRepository, Repository } from 'typeorm';

import { ImporterProvider } from '@/importer/importer.provider.entity';

export class ImporterProviderSeed {
  private importerProviderRepository: Repository<ImporterProvider>;
  private readonly baseFields: string[];

  constructor() {
    this.importerProviderRepository = getRepository(ImporterProvider);
    this.baseFields = [
      'UUID',
      'VIN',
      'Make',
      'Model',
      'Mileage',
      'Year',
      'Price',
      'Zip Code',
      'Create Date',
      'Update Date',
    ];
  }

  private getItems() {
    return this.importerProviderRepository.create([
      { name: 'Spark', fields: this.baseFields },
    ]);
  }

  public async create(): Promise<void> {
    await this.importerProviderRepository.insert(this.getItems());
  }
}
