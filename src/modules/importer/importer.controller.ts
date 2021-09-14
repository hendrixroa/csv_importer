import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Readable } from 'stream';
import { Response } from 'express';

import {
  ImporterPayload,
  ImporterUploadDto,
} from '@modules/importer/importer.dto';

import { ImporterService } from '@modules/importer/importer.service';
import { ErrorResponseType } from '@common/error.service';

@Controller('imports')
@ApiTags('Importer')
@ApiBadRequestResponse({ type: ErrorResponseType })
export class ImporterController {
  constructor(private readonly importerService: ImporterService) {}

  @ApiOperation({
    summary: 'Upload file(s) in csv format.',
  })
  @Post('')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File payload',
    type: ImporterUploadDto,
  })
  async processFiles(@UploadedFiles() files: ImporterPayload[]): Promise<void> {
    await this.importerService.processFiles(files);
  }
}
