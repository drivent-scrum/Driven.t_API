import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driven.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });

    console.log({ event });
  }

  const activityDays = await prisma.activityDay.findFirst();
  if (!activityDays) {
    const seedActivityDays = await prisma.activityDay.createMany({
      data: [
        { startsAt: dayjs().add(2, "days").toDate() },
        { startsAt: dayjs().add(3, "days").toDate() },
        { startsAt: dayjs().add(4, "days").toDate() },
      ],
    });

    console.log({ seedActivityDays });
  }

  const activities = await prisma.activity.findFirst();
  if (!activities) {
    const activityDays = await prisma.activityDay.findMany({});
    const seedActivities = await prisma.activity.createMany({
      data: [
        { 
          activityDayId: activityDays[0].id, 
          name: "Minecraft: montando o PC ideal", 
          location: "Auditório Principal", 
          capacity: 27, 
          startsAt: "09:00",
          endsAt: "10:00",
        },
        { 
          activityDayId: activityDays[0].id, 
          name: "LoL: montando o PC ideal", 
          location: "Auditório Principal", 
          capacity: 1, 
          startsAt: "09:00",
          endsAt: "10:00",
        },
        { 
          activityDayId: activityDays[0].id, 
          name: "Palestra x", 
          location: "Auditório Lateral", 
          capacity: 30, 
          startsAt: "09:00",
          endsAt: "11:00",
        },
        { 
          activityDayId: activityDays[0].id, 
          name: "Palestra y", 
          location: "Workshop", 
          capacity: 27, 
          startsAt: "09:00",
          endsAt: "10:00",
        },
        { 
          activityDayId: activityDays[0].id, 
          name: "Palestra z", 
          location: "Workshop", 
          capacity: 27, 
          startsAt: "10:00",
          endsAt: "11:00",
        },
        { 
          activityDayId: activityDays[1].id, 
          name: "Palestra a", 
          location: "Workshop", 
          capacity: 27, 
          startsAt: "09:00",
          endsAt: "10:00",
        },
        { 
          activityDayId: activityDays[2].id, 
          name: "Palestra b", 
          location: "Workshop", 
          capacity: 27, 
          startsAt: "09:00",
          endsAt: "10:00",
        },
      ]
    });

    console.log({ seedActivities });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });