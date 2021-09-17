import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationPayload, QueryParamDescription } from '@common/helpers.dto';

export class VehicleListDTO {
  @ApiProperty({
    description: QueryParamDescription.ID,
  })
  id: number;

  @ApiProperty()
  uuid: string;

  @ApiProperty()
  vin: string;

  @ApiProperty()
  make: string;

  @ApiProperty()
  model: string;

  @ApiProperty()
  mileage: number;

  @ApiProperty()
  year: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  zipCode: string;

  @ApiProperty()
  createDate: Date;

  @ApiProperty()
  updateDate: Date;
}
