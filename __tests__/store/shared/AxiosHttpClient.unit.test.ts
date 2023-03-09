import axios, { AxiosInstance } from 'axios';
import AxiosHttpClient from '@shared/AxiosHttpClient';
import { mockClear, mockDeep } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';
import HttpError from '@shared/abstractions/HttpError';

jest.mock('axios');

const axiosMocked = jest.mocked(axios);

describe("AxiosHttpClient's unit tests", () => {
  const axiosInstanceMock = mockDeep<AxiosInstance>();

  beforeAll(() => {
    axiosMocked.create.mockReturnValue(axiosInstanceMock);
  });

  afterEach(() => {
    mockClear(axiosInstanceMock);
    axiosMocked.mockClear();
  });

  it('creates a new instance of axios', () => {
    // eslint-disable-next-line no-new
    new AxiosHttpClient();

    expect(axiosMocked.create).toHaveBeenCalled();
  });

  describe('AxiosHttpClient.setDefaultHeaders()', () => {
    it('sets the default headers in the axios instance', () => {
      const httpClient = new AxiosHttpClient();

      httpClient.setDefaultHeaders({
        test_header1: 'test1',
        test_header2: 'test2',
      });

      expect(axiosInstanceMock.defaults.headers.common.test_header1).toEqual('test1');
      expect(axiosInstanceMock.defaults.headers.common.test_header2).toEqual('test2');
    });
  });

  describe('AxiosHttpClient.get()', () => {
    beforeEach(() => {
      axiosInstanceMock.get.mockResolvedValue({ data: {} });
    });

    afterEach(() => {
      axiosInstanceMock.get.mockClear();
    });

    it('calls axios.get with correct url', async () => {
      expect.assertions(1);

      const httpClient = new AxiosHttpClient();

      const fakeUrl = faker.internet.url();

      await httpClient.get(fakeUrl);

      expect(axiosInstanceMock.get).toHaveBeenCalledWith(fakeUrl, {});
    });

    it('calls axios.get with correct url and options', async () => {
      expect.assertions(1);

      const httpClient = new AxiosHttpClient();

      const fakeUrl = faker.internet.url();
      const fakeQuery = new URLSearchParams({ test1: 'test1', test2: 'test2' });
      const fakeHeaders = { test_header: 'test' };

      await httpClient.get(fakeUrl, { query: fakeQuery, headers: fakeHeaders });

      expect(axiosInstanceMock.get).toHaveBeenCalledWith(fakeUrl, {
        params: fakeQuery,
        headers: fakeHeaders,
      });
    });

    it('returns the correct data after call axios.get', async () => {
      expect.assertions(1);

      const httpClient = new AxiosHttpClient();

      const fakeData = {
        test1: 'test',
        test2: 123,
        test3: false,
        test4: {},
      };

      const fakeAxiosResponse = {
        status: faker.internet.httpStatusCode(),
        data: fakeData,
      };

      axiosInstanceMock.get.mockResolvedValueOnce(fakeAxiosResponse);

      const fakeUrl = faker.internet.url();

      const result = await httpClient.get<typeof fakeData>(fakeUrl);

      expect(result).toStrictEqual(fakeData);
    });

    it('throws a HttpError if axios.get returns a error', async () => {
      expect.assertions(3);

      const httpClient = new AxiosHttpClient();

      const fakeAxiosResponse = {
        response: {
          status: faker.internet.httpStatusCode(),
          data: { error: 'test' },
        },
      };

      axiosInstanceMock.get.mockRejectedValueOnce(fakeAxiosResponse);

      const fakeUrl = faker.internet.url();

      try {
        await httpClient.get(fakeUrl);
      } catch (e: any) {
        expect(e).toBeInstanceOf(HttpError);
        expect(e.statusCode).toEqual(fakeAxiosResponse.response.status);
        expect(e.body).toEqual(fakeAxiosResponse.response.data);
      }
    });

    it('throws a generic error if occur an unexpected error', async () => {
      expect.assertions(2);

      const httpClient = new AxiosHttpClient();

      axiosInstanceMock.get.mockRejectedValueOnce(new Error('test'));

      const fakeUrl = faker.internet.url();

      try {
        await httpClient.get(fakeUrl);
      } catch (e: any) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual('Unexpected error');
      }
    });
  });
});
