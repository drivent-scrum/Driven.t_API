import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services';
import { redis } from '@/config';

const DEFAULT_EXPIRATION = 120;

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const cacheHotels = await redis.get('hotels');
  if (cacheHotels) {
    return res.status(httpStatus.OK).send(JSON.parse(cacheHotels));
  }

  const { userId } = req;

  const hotels = await hotelsService.getHotels(userId);
  await redis.set('hotels', JSON.stringify(hotels), 'EX', DEFAULT_EXPIRATION);

  res.status(httpStatus.OK).send(hotels);
}

export async function getHotelsWithRooms(req: AuthenticatedRequest, res: Response) {
  const cacheHotelWithRooms = await redis.get('hotelWithRooms');
  if (cacheHotelWithRooms) {
    return res.status(httpStatus.OK).send(JSON.parse(cacheHotelWithRooms));
  }

  const { userId } = req;
  const hotelId = Number(req.params.hotelId);

  const hotelWithRooms = await hotelsService.getHotelsWithRooms(userId, hotelId);
  await redis.set('hotelWithRooms', JSON.stringify(hotelWithRooms), 'EX', DEFAULT_EXPIRATION);

  res.status(httpStatus.OK).send(hotelWithRooms);
}

export async function getAllHotelsWithRooms(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotels = await hotelsService.getAllHotelsWithRooms(userId);
  res.status(httpStatus.OK).send(hotels);
}
