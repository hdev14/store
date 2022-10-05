import supertest from 'supertest';
import Server from '@api/Server';
import Prisma from '@shared/Prisma';
import Mongo from '@mongo/index';

beforeAll(async () => {
  try {
    globalThis.request = supertest(Server.application);
    globalThis.dbConnection = Prisma.connect();
    await Mongo.connect(process.env.MONGO_URL!);
  } catch (e: any) {
    console.error(e.stack);
  }
});

afterAll(async () => {
  try {
    await globalThis.dbConnection.$disconnect();
    await Mongo.disconnect();
  } catch (e: any) {
    console.error(e.stack);
  }
});
