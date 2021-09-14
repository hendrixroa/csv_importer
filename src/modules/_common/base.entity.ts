import { Column, Generated, PrimaryColumn, ValueTransformer } from 'typeorm';
import { Exclude } from 'class-transformer';

export const ToBigInt: ValueTransformer = {
  to: (entityValue: number) => entityValue,
  from: (databaseValue: string): number => parseInt(databaseValue, 10),
};

@Exclude()
export abstract class BaseEntity {
  @Generated('increment')
  @PrimaryColumn('integer', { transformer: [ToBigInt] })
  id?: number;
}
