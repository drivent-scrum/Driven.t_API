import { Redis } from 'ioredis';
import app, { init } from '@/app';

export const redis = new Redis(process.env.REDIS_URL);

const port = +process.env.PORT || 4000;

init().then(() => {
  app.listen(port, () => {
    /* eslint-disable-next-line no-console */
    console.log(`Server is listening on port ${port}.`);
  });
});
