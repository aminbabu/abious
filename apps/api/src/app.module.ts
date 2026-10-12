import {
  Module,
  NestModule,
  MiddlewareConsumer,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE, APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

// Root Controllers & Services
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

// Database Core
import { DbModule } from './db/db.module.js';

// Autonomous Packages
import { AuthModule, AuthGuard, RolesGuard } from './packages/auth/index.js';
import { LoggerModule, LoggingInterceptor } from './packages/logger/index.js';
import { AuditModule } from './packages/audit/index.js';
import { ReportModule } from './packages/report/index.js';
import { SettingsModule } from './packages/settings/index.js';
import { CmsModule } from './packages/cms/index.js';
import { BlogsModule } from './packages/blogs/index.js';
import { CaseStudiesModule } from './packages/case-studies/index.js';
import { ContactModule } from './packages/contact/index.js';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Global Pipeline Providers
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor.js';
import { SelectiveBodyParserMiddleware } from './common/middlewares/selective-body-parser.middleware.js';
import { CorrelationIdMiddleware } from './common/middlewares/correlation-id.middleware.js';
import { CorsMiddleware } from './common/middlewares/cors.middleware.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    }),
    DbModule,
    LoggerModule.forRoot({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    }),
    AuthModule.forRoot(),
    AuditModule.forRoot(),
    ReportModule.forRoot(),
    SettingsModule.forRoot(),
    CmsModule.forRoot(),
    BlogsModule.forRoot(),
    CaseStudiesModule.forRoot(),
    ContactModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 1. Global DTO Validation
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    },
    // 2. Global Exception Envelope
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // 3. Global Authentication & RBAC Guards
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // 4. Global Logging & Envelope Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Correlation ID and CORS across all endpoints
    consumer.apply(CorrelationIdMiddleware, CorsMiddleware).forRoutes('*');

    // Selective body parser: raw stream on /api/auth/*, parsed JSON on everything else
    consumer
      .apply(SelectiveBodyParserMiddleware)
      .exclude('api/auth/(.*)')
      .forRoutes('*');
  }
}
