import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { eventsService } from '@/services';
import { redis } from '@/config';

const DEFAULT_EXPIRATION = 300;

export async function getDefaultEvent(_req: Request, res: Response) {
  const cacheEvent = await redis.get('event');
  if (cacheEvent) {
    return res.status(httpStatus.OK).send(JSON.parse(cacheEvent));
  }

  const event = await eventsService.getFirstEvent();
  await redis.set('event', JSON.stringify(event), 'EX', 10);

  res.status(httpStatus.OK).send(event);
}

export async function updateEvent(req: Request, res: Response) {
  const { title, backgroundImageUrl, logoImageUrl, startsAt, endsAt } = req.body;
  const event = await eventsService.updateEvent(title, backgroundImageUrl, logoImageUrl, startsAt, endsAt);
  res.status(httpStatus.OK).send(event);
}
