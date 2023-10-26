import { Activity } from '@prisma/client';
import { conflictError, notFoundError } from '@/errors';
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

  const timeConflictActivites = userActivities.filter(
    (userActivity) =>
      startsAt < formatTimestamp(userActivity.endsAt) && endsAt > formatTimestamp(userActivity.startsAt),
  );

  if (timeConflictActivites.length >= 1) throw conflictError('Cannot register activities with overlap in time!');
}

function formatTimestamp(timestamp: string) {
  return Number(timestamp.split(':').join(''));
}

export const activitiesService = {
  getActivitiesDay,
  getActivitiesFromDay,
  registerActivity,
};
