import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import SentryModule from './helpers/sentry';
import { AllExceptionsFilter } from './helpers/all-exceptions.filter';
import { Logger } from './helpers/logger';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from './i18n/i18n.generated';

process.on('uncaughtException', (err) => {
  const logger = new Logger('uncaughtException');
  logger.error(err, 'uncaughtException');
});
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const i18n: I18nService<I18nTranslations> = app.get(I18nService);

  SentryModule(app);

  const filter = new AllExceptionsFilter(i18n);
  filter.setHttpAdapterHost(app.get(HttpAdapterHost));

  app.enableCors((req, callback) => {
    const corsOpt = {
      credentials: true,
      origin: req.headers.origin || '*',
      methods: 'GET,PUT,PATCH,POST,DELETE',
    };
    callback(null, corsOpt);
  });
  const logger = new Logger();
  app
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json({ limit: '30mb' }))
    .use(cookieParser())
    .use(
      morgan(
        ':remote-addr :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" - :response-time ms',
        {
          stream: {
            write: function (str) {
              logger.log(str, i18n.t('main.messages.incoming_req'));
            },
          },
        },
      ),
    )
    .use((req, res, next) => {
      req.sentryContext = { tags: {}, breadcrumbs: [] };
      next();
    });
  await app.listen(configService.get('PORT')).then((app) =>
    logger.verbose(
      i18n.t('main.messages.server_port', {
        args: { port: app.address().port },
      }),
      'NestApplication',
    ),
  );
}
bootstrap().then().catch();
