import Joi from 'joi';
import { InputTicketBody } from '@/protocols';

export const ticketSchema = Joi.object<InputTicketBody>({
  ticketTypeId: Joi.number().required(),
});

export const ticketTypeSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().required(),
  price: Joi.number().required(),
  isRemote: Joi.boolean().required(),
  includesHotel: Joi.boolean().required(),
});
