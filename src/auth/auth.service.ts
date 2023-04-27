import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '../helpers/logger';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '../i18n/i18n.generated';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly i18n: I18nService<I18nTranslations>,
  ) {
  }

  sendCode(email: string) {
    throw new BadRequestException(this.i18n.t('auth.errors.wrong_login_or_password'))
  }
}
