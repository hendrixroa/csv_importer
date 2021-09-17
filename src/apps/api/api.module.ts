import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

// Middlewares
import { LoggerMiddleware } from '@api/middlewares/logger.middleware';

// Modules
import { VehicleModule } from '@/vehicle/vehicle.module';
import { ImporterModule } from '@/importer/importer.module';
import { CommonModule } from '@common/common.module';

@Module({
  imports: [CommonModule, ImporterModule, VehicleModule].sort(),
})
export class APIModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
