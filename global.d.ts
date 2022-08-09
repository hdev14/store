declare module globalThis {
  declare var request: import('supertest').SuperTest<import('supertest').Test>;
}
