import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';
import { CreateTicketParams } from '@/protocols';

async function findTicketTypes() {
  const result = await prisma.ticketType.findMany();
  return result;
}

async function createTicketType(name: string, price: number, isRemote: boolean, includesHotel: boolean) {
  return prisma.ticketType.create({
    data: {
      name,
      price,
      isRemote,
      includesHotel,
    },
  });
}
async function updateTicketType(id: number, name: string, price: number, isRemote: boolean, includesHotel: boolean) {
  return prisma.ticketType.update({
    where: {
      id,
    },
    data: {
      name,
      price,
      isRemote,
      includesHotel,
      updatedAt: new Date(),
    },
  });
}

async function findTicketByEnrollmentId(enrollmentId: number) {
  const result = await prisma.ticket.findUnique({
    where: { enrollmentId },
    include: { TicketType: true },
  });

  return result;
}

async function createTicket(ticket: CreateTicketParams) {
  const result = await prisma.ticket.create({
    data: ticket,
    include: { TicketType: true },
  });

  return result;
}

async function findTicketById(ticketId: number) {
  const result = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { TicketType: true },
  });

  return result;
}

async function ticketProcessPayment(ticketId: number) {
  const result = prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: TicketStatus.PAID,
    },
  });

  return result;
}

export const ticketsRepository = {
  findTicketTypes,
  findTicketByEnrollmentId,
  createTicket,
  findTicketById,
  ticketProcessPayment,
  createTicketType,
  updateTicketType,
};
