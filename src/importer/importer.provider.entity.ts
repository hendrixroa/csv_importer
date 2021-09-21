import { Column, Entity, Unique } from 'typeorm';

import { BaseEntity } from '@common/base.entity';

@Unique(['name'])
@Entity({ name: 'importer_providers' })
export class ImporterProvider extends BaseEntity {
  constructor(partial: Partial<ImporterProvider> = {}) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    nullable: false,
    type: 'text',
    unique: true,
  })
  name: string;

  @Column({
    nullable: false,
    type: 'text',
    array: true,
  })
  fields: string[];
}
