import faker from '@faker-js/faker';
import { Activity, ActivityDay } from '@prisma/client';
import { prisma } from '@/config';

export async function getAllActivitiesDay() {
  return await prisma.activityDay.findMany({
    orderBy: { startsAt: 'asc' },
  });
}

export async function getActivitiesDayById(id: number) {
  return await prisma.activityDay.findUnique({
    where: { id },
  });
}

export async function createActivityDay(params: Partial<Activity> = {}) {
  const { startsAt, createdAt, name, capacity, endsAt } = params;
  return await prisma.activity.create({
    data: {
      createdAt: createdAt || new Date(),
      name: name || faker.lorem.words(3),
      capacity: capacity || 10,
      startsAt: startsAt ? startsAt.toString() : new Date().toISOString(),
      endsAt: endsAt ? endsAt.toString() : new Date().toISOString(),
      location: faker.address.city(),
      ActivityDay: {
        connect: {
          id: 1,
        },
      },
    },
  });
}
