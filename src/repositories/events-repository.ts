import { prisma } from '@/config';

async function findFirst() {
  return prisma.event.findFirst();
}

async function update(
  id: number,
  title: string,
  backgroundImageUrl: string,
  logoImageUrl: string,
  startsAt: Date,
  endsAt: Date,
) {
  return prisma.event.update({
    where: { id: id },
    data: {
      title,
      backgroundImageUrl,
      logoImageUrl,
      startsAt,
      endsAt,
      updatedAt: new Date(),
    },
  });
}

async function create(title: string, backgroundImageUrl: string, logoImageUrl: string, startsAt: Date, endsAt: Date) {
  return prisma.event.create({
    data: {
      title,
      backgroundImageUrl,
      logoImageUrl,
      startsAt,
      endsAt,
      updatedAt: new Date(),
    },
  });
}

export const eventRepository = {
  findFirst,
  update,
  create,
};
