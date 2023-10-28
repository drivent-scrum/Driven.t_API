import { Router } from 'express';
import { getDefaultEvent, updateEvent } from '@/controllers';

const eventsRouter = Router();

eventsRouter.get('/', getDefaultEvent);
eventsRouter.put('/', updateEvent);

export { eventsRouter };
