import { DynamicModule, Global, Module } from '@nestjs/common';
import { AppLoggerService } from './services/app-logger.service.js';
import { LoggingInterceptor } from './interceptors/logging.interceptor.js';

export interface LoggerModuleOptions {
  level?: string;
}

@Global()
@Module({
  providers: [AppLoggerService, LoggingInterceptor],
  exports: [AppLoggerService, LoggingInterceptor],
})
export class LoggerModule {
  static forRoot(options?: LoggerModuleOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: 'LOGGER_OPTIONS',
          useValue: options ?? {},
        },
        AppLoggerService,
        LoggingInterceptor,
      ],
      exports: [AppLoggerService, LoggingInterceptor],
    };
  }
}
