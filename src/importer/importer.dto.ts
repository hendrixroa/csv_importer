import { ApiProperty } from '@nestjs/swagger';

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
