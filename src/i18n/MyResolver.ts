import { ExecutionContext, Injectable } from '@nestjs/common';
import { I18nResolver } from 'nestjs-i18n';

@Injectable()
export class MyResolver implements I18nResolver {

  resolve(context: ExecutionContext) {
    console.log('in resolver');
    return 'en';
  }
}
