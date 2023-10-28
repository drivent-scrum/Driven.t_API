import { Router } from 'express';
import { createTicket, createTicketType, getTicket, getTicketTypes, updateTicketType } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { ticketSchema, ticketTypeSchema } from '@/schemas/tickets-schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketTypes)
  .post('/types', validateBody(ticketTypeSchema), createTicketType)
  .put('/types', validateBody(ticketTypeSchema), updateTicketType)
  .get('/', getTicket)
  .post('/', validateBody(ticketSchema), createTicket);

export { ticketsRouter };
