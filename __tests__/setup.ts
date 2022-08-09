import { Server } from '@api/Server';
import supertest from 'supertest';

beforeAll(() => {
  globalThis.request = supertest(new Server());
});
