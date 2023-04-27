import { resolve } from 'path';
import * as dotenv from 'dotenv';

const { env } = process;
const PRODUCTION: boolean =
  String(env.PRODUCTION || false).toLowerCase() == 'true';
if (!PRODUCTION) {
  dotenv.config({ path: resolve(__dirname + '/../../.env') });
}
export default () => ({
  PRODUCTION,
  PORT: parseInt(env.PORT) || 3001,
  SENTRY: false
});
