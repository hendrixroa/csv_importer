import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as faker from 'faker';

import { VehicleController } from '@/vehicle/vehicle.controller';
import { VehicleService } from '@/vehicle/vehicle.service';
import { VehicleListDTO } from '@/vehicle/vehicle.dto';
import { ListResult } from '@common/helpers.dto';
import { ModuleTestUtil } from 'test/util/module.test.util';

@suite()
export class VehicleControllerTest {
  private vehicleController: VehicleController;
  private vehicleService: VehicleService;
  private moduleTestUtil: ModuleTestUtil;

  async before(): Promise<void> {
    this.moduleTestUtil = new ModuleTestUtil();
    this.vehicleService = await this.moduleTestUtil.getVehicleModule();
    this.vehicleController = new VehicleController(this.vehicleService);
  }

  @test('Return a list of vehicles dto')
  async listVehicles(): Promise<void> {
    const vehicleDTO = new VehicleListDTO();
    vehicleDTO.id = faker.datatype.number({ min: 1, max: 100 });
    vehicleDTO.uuid = faker.datatype.uuid();
    vehicleDTO.vin = faker.vehicle.vin();
    vehicleDTO.make = faker.vehicle.manufacturer();
    vehicleDTO.model = faker.vehicle.model();
    vehicleDTO.mileage = faker.datatype.number({ min: 5000, max: 999999 });
    vehicleDTO.year = faker.datatype.number({ min: 1950, max: 2021 });
    vehicleDTO.price = faker.datatype.float({ min: 5000.0, max: 999999.9 });
    vehicleDTO.zipCode = faker.address.zipCode();
    vehicleDTO.createDate = faker.date.past();
    vehicleDTO.updateDate = faker.date.soon();
    const result = {
      items: [vehicleDTO],
      meta: {
        count: 1,
        page: 1,
        pages: 1,
      },
    } as ListResult<VehicleListDTO>;
    const stub = sinon
      .stub(this.vehicleService, 'list')
      .resolves(result as unknown as ListResult<VehicleListDTO[]>);

    const resultController = await this.vehicleController.listVehicles({});

    expect(stub.calledOnce).to.be.true;
    expect(resultController.data.items[0]).to.be.eq(vehicleDTO);
  }

  async after() {
    await this.moduleTestUtil.tearDownConnection();
  }
}
