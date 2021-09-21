import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ImporterUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  files: any[];
}

export class ImporterPayload {
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export class ImporterProviderPayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
