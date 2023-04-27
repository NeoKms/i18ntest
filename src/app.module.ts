import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config';
import { ConfigModule } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import { I18nModule } from 'nestjs-i18n';
import * as pathModule from 'path';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from "./auth/auth.module";
import { MyResolver } from "./i18n/MyResolver";

@Module({
  imports: [
    NestjsFormDataModule.config({ isGlobal: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'fr',
      loaderOptions: {
        path: pathModule.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        new MyResolver()
      ],
      typesOutputPath: pathModule.join(
        __dirname,
        '../src/i18n/i18n.generated.ts',
      ),
    }),
    ScheduleModule.forRoot(),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(Sentry.Handlers.requestHandler()).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
