import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getActivitiesDay, getActivitiesFromDay, registerActivity } from '@/controllers';
import { activitiesSchema } from '@/schemas/activities-schemas';

const activitiesRouter = Router();

activitiesRouter
  .all('/*', authenticateToken)
  .get('/', getActivitiesDay)
  .get('/:activityDayId', getActivitiesFromDay)
  .post('/', validateBody(activitiesSchema), registerActivity);

export { activitiesRouter };
