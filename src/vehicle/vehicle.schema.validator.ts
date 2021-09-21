import * as joi from 'joi';

export class VehicleSchemaValidator {
  private static vehicleSchema = joi.object({
    UUID: joi
      .string()
      .guid({
        version: ['uuidv4', 'uuidv5'],
      })
      .required(),
    VIN: joi.string().alphanum().min(11).max(17).required(),
    Make: joi.string().required(),
    Model: joi.string().required(),
    Mileage: joi.number().min(0).max(300000).required(),
    Year: joi.number().min(1886).max(2021).required(),
    Price: joi.number().min(500).max(50000000).required(),
    'Zip Code': joi.string().required(),
    'Create Date': joi.date().iso().required(),
    'Update Date': joi.date().iso().required(),
  });

  public static validate(vehicleData: any) {
    return this.vehicleSchema.validate(vehicleData);
  }
}
