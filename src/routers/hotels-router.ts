import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllHotelsWithRooms, getHotels, getHotelsWithRooms, updateHotelWithRooms } from '@/controllers';

const hotelsRouter = Router();
hotelsRouter.get('/all-with-rooms', getAllHotelsWithRooms);
hotelsRouter.put('/:hotelId', updateHotelWithRooms);
hotelsRouter.all('/*', authenticateToken).get('/', getHotels).get('/:hotelId', getHotelsWithRooms);

export { hotelsRouter };
