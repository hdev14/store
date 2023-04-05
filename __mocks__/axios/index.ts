export const getMock = jest.fn();
export const postMock = jest.fn();
export const putMock = jest.fn();
export const deleteMock = jest.fn();
export const patchMock = jest.fn();

export default {
  create: jest.fn().mockReturnValue({
    get: getMock,
    post: postMock,
    put: putMock,
    delete: deleteMock,
    patch: patchMock,
    interceptors: {
      request: {
        use: jest.fn(),
      },
    },
  }),
};
