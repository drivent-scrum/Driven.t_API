import { Activity, ActivityDay } from '@prisma/client';
import { conflictError, invalidDataError, notFoundError } from '@/errors';
import { activitiesRepository } from '@/repositories';
import { InputActivityBody } from '@/protocols';

async function getActivitiesDay() {
  const activitiesDay = await activitiesRepository.getAllActivitiesDay();
  if (!activitiesDay) throw notFoundError();

  return activitiesDay;
}

async function getActivitiesFromDay(activityDayId: number, userId: number) {
  const activitiesFromDay = await activitiesRepository.findActivitiesFromDay(activityDayId);
  if (!activitiesFromDay) throw notFoundError();

  const userActivities = await activitiesRepository.getUserActivities(userId);
  const userActivitiesIds = userActivities.map((activity) => activity.id);

  return { activitiesFromDay, userActivitiesIds };
}

async function getActivitiesCount(userId: number) {
  const activitiesCount = await activitiesRepository.getActivitiesCount(userId);
  return activitiesCount;
}

async function registerActivity(params: InputActivityBody, userId: number) {
  const { activityId, activityDayId } = params;

  const activityDay = await activitiesRepository.findActivityDayById(activityDayId);
  if (!activityDay) throw notFoundError();

  const activity = await activitiesRepository.findActivityById(activityId);
  if (!activity) throw notFoundError();

  if (activity.capacity <= 0) throw conflictError('Activity maximum capacity exceeded.');

  const userActivities = await activitiesRepository.getUserActivities(userId);
  if (userActivities.length >= 1) checkTimeConflicts(activity, userActivities);

  await activitiesRepository.registerUserActivity(activityId, activityDayId, userId);
  await activitiesRepository.updateActivityCapacity(activity);
}

function checkTimeConflicts(activity: Activity, userActivities: Activity[]) {
  const startsAt = formatTimestamp(activity.startsAt);
  const endsAt = formatTimestamp(activity.endsAt);

  const timeConflictActivites = userActivities.filter((userActivity) => {
    const timeConflict =
      startsAt < formatTimestamp(userActivity.endsAt) && endsAt > formatTimestamp(userActivity.startsAt);

    const sameActivityDay = activity.activityDayId === userActivity.activityDayId;

    if (timeConflict && sameActivityDay) return true;
  });

  if (timeConflictActivites.length >= 1) throw conflictError('Cannot register activities with overlap in time!');
}

function formatTimestamp(timestamp: string) {
  return Number(timestamp.split(':').join(''));
}

async function changeActivityDay(activityDayId: number, params: UpdateActivityDay) {
  await activitiesRepository.updateActivityDay(activityDayId, params);
}

async function changeActivityFromDay(activityFromDay: number, params: UpdateAcitivity) {
  await activitiesRepository.updateActivityFromDay(activityFromDay, params);
}

async function deleteActivityDay(activityDayId: number) {
  await activitiesRepository.deleteActivityDay(activityDayId);
}

async function deleteActivityFromDay(activityId: number) {
  await activitiesRepository.deleteActivityFromDay(activityId);
}

type ActivityDayParams = ActivityDay;
type ActivityParams = Partial<Activity>;

export type UpdateActivityDay = Pick<ActivityDayParams, 'startsAt'>;
export type UpdateAcitivity = Omit<ActivityParams, 'id' | 'createdAt' | 'updatedAt'>;

export const activitiesService = {
  getActivitiesDay,
  getActivitiesFromDay,
  registerActivity,
  changeActivityDay,
  changeActivityFromDay,
  deleteActivityDay,
  deleteActivityFromDay,
  getActivitiesCount,
};
