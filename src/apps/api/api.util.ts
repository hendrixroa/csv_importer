import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, LogLevel } from '@nestjs/common';

import { APIModule } from './api.module';
import { swaggerDescription } from './api.constant';

export class APIUtil {
  private description: string;

  constructor() {
    this.description = swaggerDescription;
  }

  public async initApp(logLevel?: LogLevel[]): Promise<INestApplication> {
    return await NestFactory.create(APIModule, {
      cors: true,
      logger: logLevel || ['error', 'warn'],
    });
  }

  public async generateSwagger(app?: INestApplication): Promise<OpenAPIObject> {
    if (!app) {
      app = await this.initApp();
    }

    const config = new DocumentBuilder()
      .setTitle('CSV_Importer')
      .setDescription(this.description)
      .setVersion('1.0.0')
      .build();

    const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
    return document;
  }
}
