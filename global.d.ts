declare module globalThis {
  declare var request: import('supertest').SuperTest<import('supertest').Test>;
  declare var dbConnection: import('@prisma/client').PrismaClient;
}
