import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import * as csv from 'csvtojson';
import * as joi from 'joi';

import { APPConfig } from '@config/app.config';
import { ImporterPayload } from '@/importer/importer.dto';

import { BaseService } from '@common/base.service';
import { Vehicle } from '@/vehicle/vehicle.entity';
import { VehicleSchemaValidator } from '@/vehicle/vehicle.schema.validator';
import { BadRequestError } from '@/_common/error.service';

export const headers = [
  'UUID',
  'VIN',
  'Make',
  'Model',
  'Mileage',
  'Year',
  'Price',
  'Zip Code',
  'Create Date',
  'Update Date',
];

@Injectable()
export class ImporterService extends BaseService {
  private readonly appConfig: APPConfig;

  constructor() {
    super();
    this.appConfig = this.configService.loadConfig(APPConfig);
  }

  /*public async processFiles(files: ImporterPayload[]): Promise<void> {
    const filesCsv = files.filter((file) => file.mimetype === 'text/csv');
    for (const file of filesCsv) {
      try {
        const streamFile = Readable.from(file.buffer.toString());
        streamFile
          .pipe(
            parse({
              headers,
              trim: true,
              discardUnmappedColumns: true,
              ignoreEmpty: true,
              skipLines: 1,
              delimiter: this.appConfig.CSV_DELIMITER,
            }),
          )
          .transform((data: any): void => {
            streamFile.emit('error', new Error('errorcito0: ') );
          })
          .on('data', this.saveVehicles)
          .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`))
          .on('error', (error) => new Error('errorcito1: '));
      } catch (err) {
        console.log('errorcito2');
      }
    }
  }*/

  public async processFiles2(files: ImporterPayload[]): Promise<void> {
    const filesCsv = files.filter((file) => file.mimetype === 'text/csv');
    for (const file of filesCsv) {
      const dataStrFile = file.buffer.toString();
      const dataFile = await csv().fromString(dataStrFile);
      const vehicles: Vehicle[] = [];
      for (const vehicleItem of dataFile) {
        this.validateVehicleData(vehicleItem);
        const vehicle = this.converToVehicleItem(vehicleItem);
        vehicles.push(vehicle);
      }
    }
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

  private converToVehicleItem(data: any): Vehicle {
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
