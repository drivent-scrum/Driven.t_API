import { Activity } from '@prisma/client';
import dayjs from 'dayjs';
import { prisma } from '@/config';
import { UpdateAcitivity, UpdateActivityDay } from '@/services';

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

async function updateActivityCapacity(activity: Activity) {
  return await prisma.activity.update({
    data: { capacity: activity.capacity - 1 },
    where: { id: activity.id },
  });
}

async function updateActivityDay(activityDayId: number, params: UpdateActivityDay) {
  const updatedAt = dayjs().toDate();

  return await prisma.activityDay.update({
    where: { id: activityDayId },
    data: {
      startsAt: params.startsAt,
      updatedAt,
    },
  });
}

async function getActivitiesCount(userId: number) {
  const count = await prisma.activityRegistration.aggregate({
    where: {
      userId: userId,
    },
    _count: {
      _all: true,
    },
  });

  return count._count._all;
}

async function updateActivityFromDay(activityFromDayId: number, params: UpdateAcitivity) {
  const updatedAt = dayjs().toDate();

  return await prisma.activity.update({
    where: { id: activityFromDayId },
    data: {
      activityDayId: params.activityDayId || undefined,
      name: params.name || undefined,
      location: params.location || undefined,
      capacity: params.capacity || undefined,
      startsAt: params.startsAt || undefined,
      updatedAt,
    },
  });
}

async function deleteActivityDay(activityDayId: number) {
  await prisma.activityRegistration.deleteMany({
    where: { activityDayId },
  });

  return await prisma.activityDay.delete({
    where: { id: activityDayId },
  });
}

async function deleteActivityFromDay(activityId: number) {
  await prisma.activityRegistration.deleteMany({
    where: { activityId },
  });

  return await prisma.activity.delete({
    where: { id: activityId },
  });
}

export const activitiesRepository = {
  getAllActivitiesDay,
  findActivityDayById,
  findActivitiesFromDay,
  findActivityById,
  getUserActivities,
  registerUserActivity,
  updateActivityCapacity,
  updateActivityDay,
  updateActivityFromDay,
  deleteActivityDay,
  deleteActivityFromDay,
  getActivitiesCount,
};
