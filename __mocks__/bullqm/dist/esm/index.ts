import { Queue } from 'bullmq';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';

export const queueMock = mockDeep<Queue>() as unknown as DeepMockProxy<Queue>;
export const queueConstructorMock = jest.fn().mockImplementation(() => queueMock);

jest.mock('bullmq', () => ({
  Queue: queueConstructorMock,
}));

beforeEach(() => {
  mockReset(queueMock);
});

export default {
  Queue: queueConstructorMock,
};
