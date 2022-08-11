import 'tsconfig-paths/register';
import Server from '@api/Server';
import supertest from 'supertest';
import Prisma from '@shared/Prisma';

export default function setup() {
  console.info('--- Global Setup ---');
  globalThis.request = supertest(Server.application);
  globalThis.dbConnection = Prisma.connect();
}
