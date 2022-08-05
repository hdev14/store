/* eslint-disable wrap-iife */
import Prisma from '@shared/Prisma';
import Server from './Server';

(async function main() {
  let connection;

  try {
    connection = Prisma.connect();

    Server.application.listen(3000, () => {
      console.info('Server is running at http://localhost:3000');
    });
  } catch (e: any) {
    console.error(e.stack);
  } finally {
    if (connection) {
      await connection.$disconnect();
    }
  }
})();
