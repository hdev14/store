import Server from '@api/Server';
import supertest from 'supertest';
import Prisma from '@shared/Prisma';
import { PrismaClient } from '@prisma/client';

let connection: PrismaClient;

beforeAll(() => {
  globalThis.request = supertest(Server.application);
  connection = Prisma.connect();
});

afterAll(async () => {
  await connection.$disconnect();
});
