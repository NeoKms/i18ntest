export const MESSAGE_OK = { message: 'ok' };
export const getNowTimestampSec = (): number => {
  return Math.round(Date.now() / 1000);
};
