import { prisma } from '@/config';
import { PaymentParams } from '@/protocols';
import { TicketStatus } from '@prisma/client';

async function findPaymentByTicketId(ticketId: number) {
  const result = await prisma.payment.findFirst({
    where: { ticketId },
  });
  return result;
}

async function createPayment(ticketId: number, params: PaymentParams) {
  const result = await prisma.payment.create({
    data: {
      ticketId,
      ...params,
    },
  });

  return result;
}

async function processPayment(ticketId: number, params: PaymentParams) {
  const payment = prisma.payment.create({
    data: { ticketId, ...params }
  });

  const ticketProcessPayment = prisma.ticket.update({
    where: { id: ticketId },
    data: { status: TicketStatus.PAID },
  });

  const [Payment] = await prisma.$transaction(
    [payment, ticketProcessPayment]
  );
  return Payment;
}

export const paymentsRepository = {
  findPaymentByTicketId,
  createPayment,
  processPayment
};
