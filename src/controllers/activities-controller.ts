import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { activitiesService } from '@/services';

export async function getActivitiesDay(req: AuthenticatedRequest, res: Response) {
  const activitiesDay = await activitiesService.getActivitiesDay();
  return res.status(httpStatus.OK).send(activitiesDay);
}

export async function getActivitiesFromDay(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const activityDayId = Number(req.params.activityDayId);

  const activitiesFromDay = await activitiesService.getActivitiesFromDay(activityDayId, userId);
  return res.status(httpStatus.OK).send(activitiesFromDay);
}

export async function registerActivity(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  await activitiesService.registerActivity(req.body, userId);
  return res.sendStatus(httpStatus.CREATED);
}

export async function changeActivityDay(req: AuthenticatedRequest, res: Response) {
  const activityDayId = Number(req.params.activityDayId);

  await activitiesService.changeActivityDay(activityDayId, req.body);
  return res.sendStatus(httpStatus.NO_CONTENT);
}

export async function changeActivityFromDay(req: AuthenticatedRequest, res: Response) {
  const activityId = Number(req.params.activityId);

  await activitiesService.changeActivityFromDay(activityId, req.body);
  return res.sendStatus(httpStatus.NO_CONTENT);
}
