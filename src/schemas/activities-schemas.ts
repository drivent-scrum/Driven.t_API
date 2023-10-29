import Joi from 'joi';
import { InputActivityBody } from '@/protocols';
import { UpdateAcitivity, UpdateActivityDay } from '@/services';

export const activitiesSchema = Joi.object<InputActivityBody>({
  activityDayId: Joi.number().integer().required(),
  activityId: Joi.number().integer().required(),
});

export const updateActivityDaySchema = Joi.object<UpdateActivityDay>({
  startsAt: Joi.string().isoDate().required(),
});

export const updateActivitySchema = Joi.object<UpdateAcitivity>({
  activityDayId: Joi.number().integer().greater(0),
  name: Joi.string(),
  location: Joi.string(),
  capacity: Joi.number().integer().greater(0),
  startsAt: Joi.string().isoDate(),
  endsAt: Joi.string().isoDate(),
});
