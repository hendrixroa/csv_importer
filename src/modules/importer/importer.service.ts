import { Injectable } from '@nestjs/common';
import { parse } from '@fast-csv/parse';
import { Readable } from 'stream';
import { getConnection } from 'typeorm';

import { APPConfig } from '@config/app.config';
import { ImporterPayload } from '@modules/importer/importer.dto';

import { BaseService } from '@common/base.service';
import { Vehicle } from '@modules/vehicle/vehicle.entity';

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
  constructor() {
    super();
  }

  public async processFiles(files: ImporterPayload[]): Promise<void> {
    const filesCsv = files.filter((file) => file.mimetype === 'text/csv');
    for (const file of filesCsv) {
      const streamFile = Readable.from(file.buffer.toString());
      streamFile
        .pipe(
          parse({
            headers,
            trim: true,
            discardUnmappedColumns: true,
            ignoreEmpty: true,
            skipLines: 1,
          }),
        )
        .transform(this.mapToVehicleItem)
        .on('data', this.saveVehicles)
        .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`))
        .on('error', (error) => console.error(error));
    }
  }

  private mapToVehicleItem(data: any): Vehicle {
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

  private async saveVehicles(vehicle: Vehicle): Promise<void> {
    const connection = getConnection();
    await connection.manager.save(vehicle);
  }
}
