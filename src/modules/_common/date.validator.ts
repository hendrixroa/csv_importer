import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DateService } from '@common/date.service';

@ValidatorConstraint()
export class IsDateInstance implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    return DateService.isValidDate(value) ? true : false;
  }

  defaultMessage(args: ValidationArguments): string {
    return `The field ${args.property} is not a valid string date`;
  }
}
