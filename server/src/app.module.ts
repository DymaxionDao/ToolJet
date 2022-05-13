import { MiddlewareConsumer, Module, OnApplicationBootstrap, OnModuleInit, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Sentry from '@sentry/node';
import { EmailService } from '@services/email.service';
import { SeedsService } from '@services/seeds.service';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { Connection } from 'typeorm';
import ormconfig from '../ormconfig';
import { AppController } from './controllers/app.controller';
import { EventsModule } from './events/events.module';
import { AppsModule } from './modules/apps/apps.module';
import { AppConfigModule } from './modules/app_config/app_config.module';
import { AuthModule } from './modules/auth/auth.module';
import { CaslModule } from './modules/casl/casl.module';
import { CommentModule } from './modules/comments/comment.module';
import { DataQueriesModule } from './modules/data_queries/data_queries.module';
import { DataSourcesModule } from './modules/data_sources/data_sources.module';
import { FoldersModule } from './modules/folders/folders.module';
import { FolderAppsModule } from './modules/folder_apps/folder_apps.module';
import { GroupPermissionsModule } from './modules/group_permissions/group_permissions.module';
import { LibraryAppModule } from './modules/library_app/library_app.module';
import { MetaModule } from './modules/meta/meta.module';
import { SentryModule } from './modules/observability/sentry/sentry.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { SeedsModule } from './modules/seeds/seeds.module';
import { SsoModule } from './modules/sso/sso.module';
import { ThreadModule } from './modules/thread/thread.module';
import { UsersModule } from './modules/users/users.module';

const imports = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [`../.env.${process.env.NODE_ENV}`, '../.env'],
  }),
  LoggerModule.forRoot({
    pinoHttp: {
      level: (() => {
        const logLevel = {
          production: 'info',
          development: 'debug',
          test: 'error',
        };

        return logLevel[process.env.NODE_ENV] || 'info';
      })(),
      autoLogging: {
        ignorePaths: ['/api/health'],
      },
      prettyPrint:
        process.env.NODE_ENV !== 'production'
          ? {
              colorize: true,
              levelFirst: true,
              translateTime: 'UTC:mm/dd/yyyy, h:MM:ss TT Z',
            }
          : false,
      redact: ['req.headers.authorization'],
    },
  }),
  TypeOrmModule.forRoot(ormconfig),
  AppConfigModule,
  SeedsModule,
  AuthModule,
  UsersModule,
  AppsModule,
  FoldersModule,
  FolderAppsModule,
  DataQueriesModule,
  DataSourcesModule,
  OrganizationsModule,
  CaslModule,
  MetaModule,
  LibraryAppModule,
  GroupPermissionsModule,
  SsoModule,
];

if (process.env.SERVE_CLIENT !== 'false') {
  imports.unshift(
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'frontend/build'),
    })
  );
}

if (process.env.APM_VENDOR == 'sentry') {
  imports.unshift(
    SentryModule.forRoot({
      dsn: process.env.SENTRY_DNS,
      tracesSampleRate: 1.0,
      debug: !!process.env.SENTRY_DEBUG,
    })
  );
}

if (process.env.COMMENT_FEATURE_ENABLE !== 'false') {
  imports.unshift(CommentModule, ThreadModule, EventsModule);
}

@Module({
  imports,
  controllers: [AppController],
  providers: [EmailService, SeedsService],
})
export class AppModule implements OnModuleInit, OnApplicationBootstrap {
  constructor(private connection: Connection) {}

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(Sentry.Handlers.requestHandler()).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }

  onModuleInit(): void {
    console.log(`Initializing ToolJet server modules 📡 `);
  }

  onApplicationBootstrap(): void {
    console.log(`Initialized ToolJet server, waiting for requests 🚀`);
  }
}
