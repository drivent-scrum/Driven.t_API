import { Payment, Ticket, TicketType } from '@prisma/client';
import { invalidDataError, notFoundError, unauthorizedError } from '@/errors';
import { CardPaymentParams, PaymentParams } from '@/protocols';
import {
  enrollmentRepository,
  eventRepository,
  paymentsRepository,
  ticketsRepository,
  userRepository,
} from '@/repositories';
import { generateEmail } from '@/utils/generate-email';

async function verifyTicketAndEnrollment(userId: number, ticketId: number) {
  if (!ticketId || isNaN(ticketId)) throw invalidDataError('ticketId');

  const ticket = await ticketsRepository.findTicketById(ticketId);
  if (!ticket) throw notFoundError();

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (ticket.enrollmentId !== enrollment.id) throw unauthorizedError();

  return { ticket, enrollment };
}

async function getPaymentByTicketId(userId: number, ticketId: number) {
  await verifyTicketAndEnrollment(userId, ticketId);

  const payment = await paymentsRepository.findPaymentByTicketId(ticketId);

  return payment;
}

async function paymentProcess(ticketId: number, userId: number, price: number, cardData: CardPaymentParams) {
  const { ticket } = await verifyTicketAndEnrollment(userId, ticketId);

  const paymentData: PaymentParams = {
    ticketId,
    value: ticket.TicketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.toString().slice(-4),
  };

  const payment = await paymentsRepository.processPayment(ticketId, paymentData);
  await sendEmail(userId, payment, ticket, price);
  return payment;
}

async function sendEmail(userId: number, payment: Payment, ticket: TicketWithType, price: number) {
  const user = await userRepository.findById(userId);
  const event = await eventRepository.findFirst();

  await generateEmail(user, ticket, payment, event, price);
}

export type TicketWithType = Ticket & {
  TicketType: TicketType;
};

export const paymentsService = {
  getPaymentByTicketId,
  paymentProcess,
};
