export default async function teardown() {
  console.info('--- Global Teardown ---');
  await globalThis.dbConnection.$disconnect();
}
