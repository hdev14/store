import axios, { AxiosInstance } from 'axios';
import AxiosHttpClient from '@shared/AxiosHttpClient';
import { mockClear, mockDeep } from 'jest-mock-extended';

jest.mock('axios');

const axiosMocked = jest.mocked(axios);

describe("AxiosHttpClient's unit tests", () => {
  const axiosInstanceMock = mockDeep<AxiosInstance>();

  afterEach(() => {
    mockClear(axiosInstanceMock);
    axiosMocked.create.mockClear();
  })

  it('creates a new instance of axios', () => {
    new AxiosHttpClient();

    expect(axiosMocked.create).toHaveBeenCalled();
  });

  describe('AxiosHttpClient.setDefaultHeaders()', () => {
    it('sets the default headers in the axios instance', () => {
      axiosMocked.create.mockReturnValue(axiosInstanceMock);

      const httpClient = new AxiosHttpClient();


      httpClient.setDefaultHeaders({
        test_header1: 'test1',
        test_header2: 'test2',
      });

      expect(axiosInstanceMock.defaults.headers.common['test_header1']).toEqual('test1');
      expect(axiosInstanceMock.defaults.headers.common['test_header2']).toEqual('test2');
    });
  });
});
