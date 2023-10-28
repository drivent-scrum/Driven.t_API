import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: {
        include: {
          Booking: true,
        },
      },
    },
  });
}

async function getAllHotelsWithRooms() {
  return prisma.hotel.findMany({
    include: {
      Rooms: {
        include: {
          Booking: true,
        },
      },
    },
  });
}

async function upsertHotelWithRooms({
  id,
  name,
  image,
  rooms,
}: {
  id: number;
  name: string;
  image: string;
  rooms: { name: string; capacity: number }[];
}) {
  return await prisma.hotel.upsert({
    where: { id },
    update: {
      name: name,
      image: image,
      Rooms: {
        deleteMany: {},
        createMany: {
          data: rooms.map((room) => ({
            name: room.name,
            capacity: room.capacity,
          })),
        },
      },
    },
    create: {
      name: name,
      image: image,
      Rooms: {
        create: rooms.map((room) => ({
          name: room.name,
          capacity: room.capacity,
        })),
      },
    },
  });
}

export const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
  getAllHotelsWithRooms,
  upsertHotelWithRooms,
};
