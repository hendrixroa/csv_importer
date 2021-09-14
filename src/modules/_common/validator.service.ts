import { validateSync, ValidationError } from 'class-validator';
import { Injectable } from '@nestjs/common';

import { ErrorService } from '@common/error.service';

export interface ValidateOptions {
  throwOnError?: boolean;
  groups?: string[];
}

@Injectable()
export class ValidatorService {
  private errorService: ErrorService;

  constructor() {
    this.errorService = new ErrorService();
  }

  public validate(
    instance: any | unknown,
    { throwOnError = true, groups }: ValidateOptions = {},
  ): any {
    let errors = validateSync(instance, {
      groups,
    });

    if (errors.length) {
      errors = this.flattenErrors(errors);
      const err: string[] = this.getSummarizeErrors(errors);
      if (throwOnError) {
        this.errorService.badRequestError(err.join('\n'));
      } else {
        return err;
      }
    }
  }

  public flattenErrors(errors: ValidationError[] = []): ValidationError[] {
    errors = errors.reduce((all, error) => {
      let flatErrors = [];
      if (error.constraints) {
        flatErrors.push(error);
      }
      if (error.children) {
        error.children.forEach((childError) => {
          childError.property = `${error.property}.${childError.property}`;
        });
        flatErrors = flatErrors.concat(this.flattenErrors(error.children));
      }
      return all.concat(flatErrors);
    }, [] as ValidationError[]);
    return errors;
  }

  public getSummarizeErrors(errors: ValidationError[] = []): string[] {
    const errorsFlattened = this.flattenErrors(errors);
    const errorsSummarize: string[] = [];
    for (const error of errorsFlattened) {
      const reasons = Object.keys(error.constraints);
      for (const message of reasons) {
        errorsSummarize.push(`${error.constraints[`${message}`]}`);
      }
    }
    return errorsSummarize;
  }
}
