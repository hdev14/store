/* eslint-disable wrap-iife */
import Prisma from '@shared/Prisma';
import Server from './Server';
import './bootstrap';

(async function main() {
  let connection;

  try {
    connection = Prisma.connect();

    Server.application.listen(process.env.PORT, () => {
      if (process.env.NODE_ENV !== 'production') {
        console.info(`Server is running at http://localhost:${process.env.PORT}`);
      }
    });
  } catch (e: any) {
    console.error(e.stack);
  } finally {
    if (connection) {
      await connection.$disconnect();
    }
  }
})();
