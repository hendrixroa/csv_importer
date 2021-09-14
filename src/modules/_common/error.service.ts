import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export enum AuthenticationErrorType {
  TOKEN_EXPIRED = 'token_expired',
  BAD_CREDENTIALS = 'bad_credentials',
  TOKEN_INVALID = 'token_invalid',
  TOKEN_REQUIRED = 'token_required',
  INVALID_AUTHORIZATION_HEADER_FORMAT = 'invalid_authorization_header_format',
  MFA_DEVICE_NOT_SETTLED = 'mfa_device_not_settled',
  MFA_AUTHENTICATION_REQUIRED = 'mfa_authentication_required',
  ROLES_PERMISSION_ERROR = 'ROLES_PERMISSION_ERROR',
}

export class ErrorResponseType {
  @ApiProperty()
  errorType:
    | AuthenticationErrorType
    | 'authentication'
    | 'validation'
    | 'internal'
    | 'not_found';

  @ApiProperty({ required: false, type: [String] })
  message?: string | string[];
}

export class AuthenticationError extends UnauthorizedException {
  constructor(error: ErrorResponseType) {
    super(error);
  }
}

export class BadRequestError extends BadRequestException {
  constructor(error: ErrorResponseType) {
    super(error);
  }
}

export class InternalError extends InternalServerErrorException {
  constructor(error: ErrorResponseType) {
    super(error);
  }
}

export class NotFoundError extends NotFoundException {
  constructor(error: ErrorResponseType) {
    super(error);
  }
}

@Injectable()
export class ErrorService {
  public authenticationError(
    errorType: AuthenticationErrorType,
    message?: string,
  ): AuthenticationError {
    throw new AuthenticationError({ errorType, message });
  }

  public badRequestError(message?: string): BadRequestError {
    throw new BadRequestError({ errorType: 'validation', message });
  }

  public internalError(message?: string): InternalError {
    throw new InternalError({ errorType: 'internal', message });
  }

  public notFoundError(message?: string): NotFoundError {
    throw new NotFoundError({ errorType: 'not_found', message });
  }
}
