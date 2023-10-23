import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllHotelsWithRooms, getHotels, getHotelsWithRooms } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter
  .all('/*', authenticateToken)
  .get('/', getHotels)
  .get('/all-with-rooms', getAllHotelsWithRooms)
  .get('/:hotelId', getHotelsWithRooms);

export { hotelsRouter };
