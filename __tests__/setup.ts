import supertest from 'supertest';
import Server from '@api/Server';
import Prisma from '@shared/Prisma';
import Mongo from '@mongo/index';

beforeAll(async () => {
  globalThis.request = supertest(Server.application);
  globalThis.dbConnection = Prisma.connect();
  await Mongo.connect(process.env.MONGO_URI!);
});

afterAll(async () => {
  await globalThis.dbConnection.$disconnect();
  await Mongo.disconnect();
});
