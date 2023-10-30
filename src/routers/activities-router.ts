import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import {
  getActivitiesDay,
  getActivitiesFromDay,
  registerActivity,
  changeActivityDay,
  changeActivityFromDay,
  deleteActivityDay,
  deleteActivityFromDay,
  activitieDayCount,
} from '@/controllers';
import { activitiesSchema, updateActivitySchema, updateActivityDaySchema } from '@/schemas/activities-schemas';

const activitiesRouter = Router();

activitiesRouter
  .all('/*', authenticateToken)
  .get('/', getActivitiesDay)
  .get('/count/my-activities-day-count', activitieDayCount)
  .get('/:activityDayId', getActivitiesFromDay)
  .post('/', validateBody(activitiesSchema), registerActivity)
  .put('/activityDay/:activityDayId', validateBody(updateActivityDaySchema), changeActivityDay)
  .patch('/activityFromDay/:activityId', validateBody(updateActivitySchema), changeActivityFromDay)
  .delete('/activityDay/:activityDayId', deleteActivityDay)
  .delete('/activityFromDay/:activityId', deleteActivityFromDay);

export { activitiesRouter };
