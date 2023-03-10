declare module globalThis {
  declare var request: import('supertest').SuperTest<import('supertest').Test>;
  declare var dbConnection: import('@prisma/client').PrismaClient;
}

declare namespace NodeJS {
  interface ProcessEnv {
    KEYCLOAK_BASE_URL: string;
    KEYCLOAK_REALM_NAME: string;
    KEYCLOAK_CLIENT_ID: string;
    KEYCLOAK_CLIENT_SECRET: string;
  }
}
