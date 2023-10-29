import { Event } from '@prisma/client';
import dayjs from 'dayjs';
import { notFoundError } from '@/errors';
import { eventRepository } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';

async function getFirstEvent(): Promise<GetFirstEventResult> {
  const event = await eventRepository.findFirst();
  if (!event) throw notFoundError();

  return exclude(event, 'createdAt', 'updatedAt');
}

export type GetFirstEventResult = Omit<Event, 'createdAt' | 'updatedAt'>;

async function isCurrentEventActive(): Promise<boolean> {
  const event = await eventRepository.findFirst();
  if (!event) return false;

  const now = dayjs();
  const eventStartsAt = dayjs(event.startsAt);
  const eventEndsAt = dayjs(event.endsAt);

  return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
}

async function updateEvent(title: string, backgroundUrl: string, logoUrl: string, startDate: string, endDate: string) {
  const mainEvent = await eventRepository.findFirst();

  if (!mainEvent) {
    const createdEvent = await eventRepository.create(
      title,
      backgroundUrl,
      logoUrl,
      new Date(startDate),
      new Date(endDate),
    );
    return exclude(createdEvent, 'createdAt', 'updatedAt');
  }

  const event = await eventRepository.update(
    mainEvent.id,
    title,
    backgroundUrl,
    logoUrl,
    new Date(startDate),
    new Date(endDate),
  );
  return exclude(event, 'createdAt', 'updatedAt');
}

export const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
  updateEvent,
};
