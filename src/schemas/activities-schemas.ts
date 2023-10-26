import Joi from 'joi';
import { InputActivityBody } from '@/protocols';

export const activitiesSchema = Joi.object<InputActivityBody>({
  activityDayId: Joi.number().integer().required(),
  activityId: Joi.number().integer().required(),
});
