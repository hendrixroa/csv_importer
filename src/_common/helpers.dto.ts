import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum QueryParamDescription {
  LIMIT = 'Page size or up to number of elements to returning',
  PAGE = 'Current page requested',
  COUNT = 'Total numbers of items',
  SEARCH = 'Keyword to search if some key has match',
  ID = 'Unique ID number key use to identify items as unique',
}

export class PaginationMeta {
  @ApiProperty()
  limit: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pages: number;

  @ApiProperty()
  count: number;
}

export class PaginationPayload {
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Number,
    description: QueryParamDescription.LIMIT,
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  limit?: number = 20;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: Number,
    description: QueryParamDescription.PAGE,
    example: 1,
    default: 1,
    minimum: 1,
    maximum: 100,
  })
  page?: number = 1;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: QueryParamDescription.SEARCH,
  })
  search?: string;
}

export class SingleItemIDParam {
  @ApiProperty({ description: QueryParamDescription.ID })
  @IsNotEmpty()
  @IsNumberString()
  id: number;
}

export class SuccessResponse<T> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}

export class SingleResult<T> {
  @ApiProperty()
  item: T;
}

export class ListResult<T> {
  @ApiProperty({ minItems: 0, maxItems: 100 })
  items: T[];

  @ApiProperty({
    type: PaginationMeta,
  })
  meta?: PaginationMeta;
}
