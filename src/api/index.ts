/* eslint-disable wrap-iife */
import Prisma from '@shared/Prisma';
import Server from './Server';

(async function main() {
  let prismaConnection;

  try {
    prismaConnection = Prisma.connect();

    Server.application.listen(process.env.PORT, () => {
      if (process.env.NODE_ENV !== 'production') {
        console.info(`Server is running at http://localhost:${process.env.PORT}`);
      }
    });
  } catch (e: any) {
    console.error(e.stack);
  } finally {
    if (prismaConnection) {
      await prismaConnection.$disconnect();
    }
  }
})();
