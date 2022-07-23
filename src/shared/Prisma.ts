/* eslint-disable no-new */
import { PrismaClient } from '@prisma/client';

export default class Prisma {
  private static connection?: PrismaClient;

  protected constructor() {
    Prisma.connection = new PrismaClient();
  }

  static connect(): PrismaClient {
    if (Prisma.connection !== undefined) {
      return Prisma.connection;
    }

    new Prisma();

    return Prisma.connection!;
  }
}
