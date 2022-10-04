/* eslint-disable wrap-iife */
import Prisma from '@shared/Prisma';
import Mongo from '@mongo/index';
import Server from './Server';

(async function main() {
  let prismaConnection;

  try {
    prismaConnection = Prisma.connect();
    await Mongo.connect(process.env.MONGO_URL!);

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

    await Mongo.disconnect();
  }
})();
