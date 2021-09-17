import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import {
  ListResult,
  SingleItemIDParam,
  SingleResult,
  SuccessResponse,
} from '@common/helpers.dto';
import { ErrorResponseType } from '@common/error.service';

import { VehicleService } from '@/vehicle/vehicle.service';
import { VehicleListDTO } from '@/vehicle/vehicle.dto';
import { PaginationPayload } from '@common/helpers.dto';

@Controller(`${VehicleController.SUMMARY_NAME.toLowerCase()}s`)
@ApiTags(VehicleController.SUMMARY_NAME)
@ApiBadRequestResponse({ type: ErrorResponseType })
export class VehicleController {
  private static SUMMARY_NAME = 'Vehicle';

  constructor(private readonly vehicleService: VehicleService) {}

  @ApiOperation({
    summary: `List all ${VehicleController.SUMMARY_NAME}s`,
  })
  @ApiResponse({ status: 200, type: [VehicleListDTO] })
  @Get('')
  async listVehicles(
    @Query() query: PaginationPayload,
  ): Promise<SuccessResponse<ListResult<VehicleListDTO[]>>> {
    const result = await this.vehicleService.list(query);
    return new SuccessResponse(result);
  }
}
