import {
  Controller,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import {
  ImporterPayload,
  ImporterProviderPayload,
  ImporterUploadDto,
} from '@/importer/importer.dto';

import { ImporterService } from '@/importer/importer.service';
import { ErrorResponseType } from '@common/error.service';

@Controller('imports/provider')
@ApiTags('Importer')
@ApiBadRequestResponse({ type: ErrorResponseType })
export class ImporterController {
  constructor(private readonly importerService: ImporterService) {}

  @ApiOperation({
    summary: 'Upload file(s) in csv format given a provider name',
  })
  @Post(':name')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File payload',
    type: ImporterUploadDto,
  })
  async processFiles(
    @UploadedFiles() files: ImporterPayload[],
    @Param() provider: ImporterProviderPayload,
  ): Promise<void> {
    await this.importerService.processFiles(files, provider);
  }
}
