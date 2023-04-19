import { AxiosInstance } from 'axios';
import { mock, DeepMockProxy } from 'jest-mock-extended';

export const axiosMock = mock<AxiosInstance>() as unknown as DeepMockProxy<AxiosInstance>;

Object.assign(axiosMock, {
  defaults: {
    headers: {
      common: {},
    },
  },
});

export const createMock = jest.fn().mockReturnValue(axiosMock);

export default {
  create: createMock,
};
