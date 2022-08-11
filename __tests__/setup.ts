import supertest from 'supertest';
import Server from '@api/Server';
import Prisma from '@shared/Prisma';

beforeAll(() => {
  console.info('--- Global Setup ---');
  globalThis.request = supertest(Server.application);
  globalThis.dbConnection = Prisma.connect();
});

afterAll(async () => {
  await globalThis.dbConnection.$disconnect();
});
