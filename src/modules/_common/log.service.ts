import * as bunyan from 'bunyan';
import { Injectable } from '@nestjs/common';

import { APPConfig } from '@config/app.config';

export interface LogContext {
  requestId?: string;
  jobId?: string | number;
  path?: string;
  method?: string;
}

export interface LogData extends LogContext {
  appName: string;
  userId?: string;
  requestId?: string;
}

@Injectable()
export class LogService {
  private logger: bunyan;
  private appConfig: APPConfig;

  constructor() {
    this.appConfig = new APPConfig();
    const appName = process.env.APP || 'app';
    const logData: LogData = {
      appName,
    };

    this.logger = bunyan
      .createLogger({
        level: this.appConfig.APP_LOG_LEVEL[0] as
          | number
          | 'error'
          | 'info'
          | 'trace'
          | 'debug'
          | 'warn'
          | 'fatal'
          | undefined,
        name: 'app',
        serializers: bunyan.stdSerializers,
      })
      .child(logData);
  }

  public info({ message, data }: { message?: string; data?: any }): void {
    this.logger.info(data || {}, message);
  }

  public warn({
    message,
    data,
    err,
  }: {
    message?: string;
    data?: any;
    err?: Error;
  }): void {
    const logData: any = { ...data, err };
    this.logger.warn(logData, message);
  }

  public error({
    message,
    data,
    err,
  }: {
    message?: string;
    data?: any;
    err?: Error;
  }): void {
    const logData: any = { ...data, err };
    const statusCodeError = err as any;
    if (
      statusCodeError &&
      statusCodeError.statusCode &&
      statusCodeError.options
    ) {
      const options = statusCodeError.options;

      logData.thridPartyRequest = {
        request: {
          baseUrl: options.baseUrl,
          method: options.method,
          uri: options.uri,
        },
        response: {
          body: statusCodeError.response
            ? statusCodeError.response.body
            : undefined,
          statusCode: statusCodeError.statusCode,
        },
      };
    }

    this.logger.error(logData, message);
  }

  public getChildLog(childData: any | unknown): any {
    return {
      getChildLog: (childChildData: any) => {
        return this.getChildLog({ ...childData, ...childChildData });
      },
      error: ({
        message,
        data,
        err,
      }: {
        message?: string;
        data?: any;
        err?: Error;
      }) => {
        return this.error({
          data: { ...data, ...childData },
          err,
          message,
        });
      },
      info: ({ message, data }: { message?: string; data?: any }) => {
        return this.info({
          data: { ...data, ...childData },
          message,
        });
      },
      warn: ({
        message,
        data,
        err,
      }: {
        message?: string;
        data?: any;
        err?: Error;
      }) => {
        return this.warn({
          data: { ...data, ...childData },
          err,
          message,
        });
      },
    };
  }

  public static getLogger(appName?: string): bunyan {
    const log = bunyan.createLogger({ name: appName || process.env.APP });
    return log;
  }
}
