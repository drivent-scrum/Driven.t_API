import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllHotelsWithRooms, getHotels, getHotelsWithRooms, updateHotelWithRooms } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter
  .all('/*', authenticateToken)
  .put('/:hotelId', updateHotelWithRooms)
  .get('/', getHotels)
  .get('/all-with-rooms', getAllHotelsWithRooms)
  .get('/:hotelId', getHotelsWithRooms);

export { hotelsRouter };
