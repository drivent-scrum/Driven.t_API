import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { eventsService } from '@/services';
import { redis } from '@/server';

const DEFAULT_EXPIRATION = 300;

export async function getDefaultEvent(_req: Request, res: Response) {
  const cacheEvent = await redis.get('event');
  if (cacheEvent) {
    return res.status(httpStatus.OK).send(JSON.parse(cacheEvent));
  }

  const event = await eventsService.getFirstEvent();
  await redis.set('event', JSON.stringify(event), 'EX', DEFAULT_EXPIRATION);

  res.status(httpStatus.OK).send(event);
}
