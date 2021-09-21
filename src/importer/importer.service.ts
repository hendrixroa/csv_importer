import { Injectable } from '@nestjs/common';
import { Connection, getConnection } from 'typeorm';
import * as csv from 'csvtojson';
import * as joi from 'joi';

import { APPConfig } from '@config/app.config';
import {
  ImporterPayload,
  ImporterProviderPayload,
} from '@/importer/importer.dto';

import { BaseService } from '@common/base.service';
import { Vehicle } from '@/vehicle/vehicle.entity';
import { VehicleSchemaValidator } from '@/vehicle/vehicle.schema.validator';
import { ImporterProvider } from '@/importer/importer.provider.entity';

@Injectable()
export class ImporterService extends BaseService {
  private readonly appConfig: APPConfig;
  private readonly connection: Connection;

  constructor() {
    super();
    this.appConfig = this.configService.loadConfig(APPConfig);
    this.connection = getConnection();
  }

  public async processFiles(
    files: ImporterPayload[],
    provider: ImporterProviderPayload,
  ): Promise<void> {
    const providerData = await this.getHeadersGivenProvider(provider);
    const filesCsv = files.filter((file) => file.mimetype === 'text/csv');
    const vehicles: Vehicle[] = [];
    const headers: any = providerData.fields;
    for (const file of filesCsv) {
      const dataStrFile = file.buffer.toString();
      const dataFile = await csv({
        headers: headers.split(','),
        ignoreEmpty: true,
        delimiter: this.appConfig.CSV_DELIMITER.trim(),
      }).fromString(dataStrFile);
      for (const vehicleItem of dataFile) {
        this.validateVehicleData(vehicleItem);
        const vehicle = this.convertToVehicleItem(vehicleItem);
        vehicles.push(vehicle);
      }
    }
    await this.saveVehicles(vehicles);
  }

  private async getHeadersGivenProvider(
    provider: ImporterProviderPayload,
  ): Promise<ImporterProvider> {
    const providerData = await this.connection.manager.find(ImporterProvider, {
      name: provider.name,
    });
    if (providerData.length === 0) {
      this.errorService.notFoundError(
        `The provider ${provider.name} does not exists`,
      );
    }
    return providerData[0];
  }

  private validateVehicleData(data: any) {
    const resultValidation = VehicleSchemaValidator.validate(data);
    if (resultValidation.error) {
      const messages = this.getParsedMessages(resultValidation.error.details);
      this.errorService.badRequestError(messages);
    }
  }

  private getParsedMessages(errors: joi.ValidationErrorItem[]): string {
    return errors.reduce((errAccumulator, errCurrent) => {
      const messageSplit = errCurrent.message.split('" ');
      const message = `${''.concat(
        messageSplit[0].replace('"', ''),
        '=',
        errCurrent.context.value + ' ',
        messageSplit[1],
      )}`;
      errAccumulator =
        errAccumulator !== '' ? errAccumulator.concat(message) : message;
      return errAccumulator;
    }, '');
  }

  private convertToVehicleItem(data: any): Vehicle {
    const vehicle = new Vehicle();
    vehicle.uuid = `${data.UUID}`;
    vehicle.vin = `${data.VIN}`;
    vehicle.make = `${data.Make}`;
    vehicle.model = `${data.Model}`;
    vehicle.mileage = Number(data.Mileage) || 0;
    vehicle.year = Number(data.Yea) || 0;
    vehicle.price = Number(data.Price) || 0;
    vehicle.zipCode = `${data['Zip Code']}`;
    vehicle.createDate = new Date(`${data['Create Date']}`);
    vehicle.updateDate = new Date(`${data['Update Date']}`);
    return vehicle;
  }

  private async saveVehicles(vehicles: Vehicle[]): Promise<void> {
    const connection = getConnection();
    await connection.manager.save(vehicles);
  }
}
