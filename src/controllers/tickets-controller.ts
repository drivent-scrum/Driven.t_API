import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services';
import { InputTicketBody } from '@/protocols';

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  const ticketTypes = await ticketsService.findTicketTypes();
  return res.status(httpStatus.OK).send(ticketTypes);
}
export async function createTicketType(req: Request, res: Response) {
  const { name, price, isRemote, includesHotel } = req.body;
  const ticketType = await ticketsService.createTicketType(name, Number(price), isRemote, includesHotel);
  return res.status(httpStatus.CREATED).send(ticketType);
}

export async function updateTicketType(req: Request, res: Response) {
  const { id, name, price, isRemote, includesHotel } = req.body;
  const ticketType = await ticketsService.updateTicketType(Number(id), name, Number(price), isRemote, includesHotel);
  return res.status(httpStatus.OK).send(ticketType);
}

export async function getTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const ticket = await ticketsService.getTicketByUserId(userId);
  res.status(httpStatus.OK).send(ticket);
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body as InputTicketBody;

  const ticket = await ticketsService.createTicket(userId, ticketTypeId);
  return res.status(httpStatus.CREATED).send(ticket);
}
