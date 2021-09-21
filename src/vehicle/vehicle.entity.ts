import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';

import { BaseEntity } from '@common/base.entity';

@Entity({ name: 'vehicles' })
@Exclude()
export class Vehicle extends BaseEntity {
  constructor(partial: Partial<Vehicle> = {}) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    nullable: false,
    type: 'text',
    unique: true,
  })
  uuid: string;

  @Column({
    nullable: false,
    type: 'text',
    unique: true,
  })
  vin: string;

  @Column({
    nullable: false,
    type: 'text',
  })
  make: string;

  @Column({
    nullable: false,
    type: 'text',
  })
  model: string;

  @Column({
    nullable: false,
    type: 'bigint',
  })
  mileage: number;

  @Column({
    nullable: false,
    type: 'integer',
  })
  year: number;

  @Column({
    nullable: false,
    type: 'double precision',
  })
  price: number;

  @Column({
    name: 'zip_code',
    nullable: false,
    type: 'text',
  })
  zipCode: string;

  @Column({
    name: 'create_date',
    nullable: false,
    type: 'datetime',
  })
  createDate: Date;

  @Column({
    name: 'update_date',
    nullable: false,
    type: 'datetime',
  })
  updateDate: Date;
}
