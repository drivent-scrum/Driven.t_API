import httpStatus from 'http-status';
import supertest from 'supertest';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { createEvent, createUser } from '../factories';
import { cleanDb } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('GET /event', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/enrollments');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/enrollments').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/enrollments').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 if there is no event', async () => {
      const response = await server.get('/event');

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and event data if there is an event', async () => {
      const event = await createEvent();

      const response = await server.get('/event');

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: event.id,
        title: event.title,
        backgroundImageUrl: event.backgroundImageUrl,
        logoImageUrl: event.logoImageUrl,
        startsAt: event.startsAt.toISOString(),
        endsAt: event.endsAt.toISOString(),
      });
    });
  });
});
