import supertest from 'supertest';
import Server from '@api/Server';
import Prisma from '@shared/Prisma';

jest.mock('axios');

beforeAll(async () => {
  try {
    globalThis.request = supertest(Server.application);
    globalThis.dbConnection = Prisma.connect();
  } catch (e: any) {
    console.error(e.stack);
  }
});

afterAll(async () => {
  try {
    await globalThis.dbConnection.$disconnect();
  } catch (e: any) {
    console.error(e.stack);
  }
});
