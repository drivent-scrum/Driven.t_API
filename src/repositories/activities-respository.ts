import { prisma } from '@/config';

async function getAllActivitiesDay() {
  return await prisma.activityDay.findMany({
    orderBy: { startsAt: 'asc' },
  });
}

async function findActivityDayById(activityDayId: number) {
  return await prisma.activityDay.findUnique({
    where: { id: activityDayId },
  });
}

async function findActivitiesFromDay(activityDayId: number) {
  return await prisma.activity.findMany({
    where: { activityDayId },
    orderBy: [{ location: 'asc' }, { startsAt: 'asc' }],
  });
}

async function findActivityById(activityId: number) {
  return await prisma.activity.findUnique({
    where: { id: activityId },
  });
}

async function getUserActivities(userId: number) {
  const userRegisteredActivities = await prisma.activityRegistration.findMany({
    where: { userId },
    select: { activityId: true },
  });

  const activitiesIds = userRegisteredActivities.map((activities) => activities.activityId);
  const userActivities = await prisma.activity.findMany({
    where: {
      id: { in: activitiesIds },
    },
  });

  return userActivities;
}

async function registerUserActivity(activityId: number, activityDayId: number, userId: number) {
  return await prisma.activityRegistration.create({
    data: {
      activityId,
      activityDayId,
      userId,
    },
  });
}

async function countRegisteredActivities(activityId: number) {
  const counter = await prisma.activityRegistration.aggregate({
    _count: { id: true },
    where: { activityId },
  });

  const activitiesCounter = counter._count.id;
  return activitiesCounter;
}

export const activitiesRepository = {
  getAllActivitiesDay,
  findActivityDayById,
  findActivitiesFromDay,
  findActivityById,
  getUserActivities,
  registerUserActivity,
  countRegisteredActivities,
};
