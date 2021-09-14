import * as compression from 'compression';
import * as helmet from 'helmet';
import { SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { ValidationError, ValidationPipe } from '@nestjs/common';

import { APIUtil } from '@api/api.util';
import { LogService } from '@common/log.service';
import { APIConfig } from '@api/api.config';
import { ConfigService } from '@common/config.service';
import { ValidatorService } from '@common/validator.service';
import { BadRequestError } from '@common/error.service';

async function bootstrap() {
  const logService = new LogService();
  const validatorService = new ValidatorService();
  const apiUtil = new APIUtil();
  const configService = new ConfigService();
  const apiConfig = configService.loadConfig(APIConfig);

  try {
    const app = await apiUtil.initApp();

    // Middlewares
    app.use(helmet());
    app.use(compression());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors: ValidationError[]) => {
          const plainErrors = validatorService.getSummarizeErrors(errors);
          return new BadRequestError({
            errorType: 'validation',
            message: plainErrors,
          });
        },
      }),
    );

    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
        deepLinking: true,
        displayRequestDuration: true,
        filter: '',
      },
      validatorUrl: 'https://validator.swagger.io/validator',
      explorer: true,
    };
    const document = await apiUtil.generateSwagger(app);
    SwaggerModule.setup('docs', app, document, customOptions);

    await app.listen(apiConfig.PORT);
    const messageConsole = `is running on: ${await app.getUrl()}`;
    logService.info({ message: 'API: ' + messageConsole });
    if (process.env.NODE_ENV === 'development') {
      logService.info({ message: 'Swagger docs: ' + messageConsole + '/docs' });
    }
  } catch (err) {
    logService.error({ message: 'Error init api: ', err });
  }
}
bootstrap();
