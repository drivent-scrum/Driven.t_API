import { Router } from 'express';
import { createTicket, createTicketType, getTicket, getTicketTypes, updateTicketType } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { ticketSchema, ticketTypeSchema } from '@/schemas/tickets-schemas';

const ticketsRouter = Router();

ticketsRouter.post('/types', validateBody(ticketTypeSchema), createTicketType);
ticketsRouter.put('/types', validateBody(ticketTypeSchema), updateTicketType);
ticketsRouter.get('/types-admin', getTicketTypes);
ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketTypes)
  .get('/', getTicket)
  .post('/', validateBody(ticketSchema), createTicket);

export { ticketsRouter };
