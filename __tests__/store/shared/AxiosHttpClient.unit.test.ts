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

    it('returns the correct status and body after call axios.get', async () => {
      expect.assertions(2);

      const httpClient = new AxiosHttpClient();

      const fakeResponseBody = {
        test1: faker.datatype.string(),
        test2: faker.datatype.number(),
        test3: faker.datatype.boolean(),
        test4: faker.datatype.array(),
      };

      const fakeResponse = {
        status: faker.internet.httpStatusCode(),
        data: fakeResponseBody,
      };

      axiosInstanceMock.get.mockResolvedValueOnce(fakeResponse);

      const fakeUrl = faker.internet.url();

      const response = await httpClient.get<typeof fakeResponseBody>(fakeUrl);

      expect(response.status).toStrictEqual(fakeResponse.status);
      expect(response.body).toStrictEqual(fakeResponseBody);
    });

    it('throws a HttpError if axios.get returns a error', async () => {
      expect.assertions(3);

      const httpClient = new AxiosHttpClient();

      const fakeResponse = {
        response: {
          status: faker.internet.httpStatusCode(),
          data: { error: 'test' },
        },
      };

      axiosInstanceMock.get.mockRejectedValueOnce(fakeResponse);

      const fakeUrl = faker.internet.url();

      try {
        await httpClient.get(fakeUrl);
      } catch (e: any) {
        expect(e).toBeInstanceOf(HttpError);
        expect(e.statusCode).toEqual(fakeResponse.response.status);
        expect(e.body).toEqual(fakeResponse.response.data);
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

  describe('AxiosHttpClient.delete()', () => {
    beforeEach(() => {
      axiosInstanceMock.delete.mockResolvedValue({ data: {} });
    });

    afterEach(() => {
      axiosInstanceMock.delete.mockClear();
    });

    it('calls axios.delete with correct url', async () => {
      expect.assertions(1);

      const httpClient = new AxiosHttpClient();

      const fakeUrl = faker.internet.url();

      await httpClient.delete(fakeUrl);

      expect(axiosInstanceMock.delete).toHaveBeenCalledWith(fakeUrl, {});
    });

    it('calls axios.delete with correct url and options', async () => {
      expect.assertions(1);

      const httpClient = new AxiosHttpClient();

      const fakeUrl = faker.internet.url();
      const fakeQuery = new URLSearchParams({ test1: 'test1', test2: 'test2' });
      const fakeHeaders = { test_header: 'test' };

      await httpClient.delete(fakeUrl, { query: fakeQuery, headers: fakeHeaders });

      expect(axiosInstanceMock.delete).toHaveBeenCalledWith(fakeUrl, {
        params: fakeQuery,
        headers: fakeHeaders,
      });
    });

    it('returns the correct status and body after call axios.delete', async () => {
      expect.assertions(2);

      const httpClient = new AxiosHttpClient();

      const fakeResponseBody = {
        test1: faker.datatype.string(),
        test2: faker.datatype.number(),
        test3: faker.datatype.boolean(),
        test4: faker.datatype.array(),
      };

      const fakeResponse = {
        status: faker.internet.httpStatusCode(),
        data: fakeResponseBody,
      };

      axiosInstanceMock.delete.mockResolvedValueOnce(fakeResponse);

      const fakeUrl = faker.internet.url();

      const response = await httpClient.delete<typeof fakeResponseBody>(fakeUrl);

      expect(response.status).toStrictEqual(fakeResponse.status);
      expect(response.body).toStrictEqual(fakeResponseBody);
    });

    it('throws a HttpError if axios.delete returns a error', async () => {
      expect.assertions(3);

      const httpClient = new AxiosHttpClient();

      const fakeResponse = {
        response: {
          status: faker.internet.httpStatusCode(),
          data: { error: 'test' },
        },
      };

      axiosInstanceMock.delete.mockRejectedValueOnce(fakeResponse);

      const fakeUrl = faker.internet.url();

      try {
        await httpClient.delete(fakeUrl);
      } catch (e: any) {
        expect(e).toBeInstanceOf(HttpError);
        expect(e.statusCode).toEqual(fakeResponse.response.status);
        expect(e.body).toEqual(fakeResponse.response.data);
      }
    });

    it('throws a generic error if occur an unexpected error', async () => {
      expect.assertions(2);

      const httpClient = new AxiosHttpClient();

      axiosInstanceMock.delete.mockRejectedValueOnce(new Error('test'));

      const fakeUrl = faker.internet.url();

      try {
        await httpClient.delete(fakeUrl);
      } catch (e: any) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual('Unexpected error');
      }
    });
  });

  describe('AxiosHttpClient.post()', () => {
    beforeEach(() => {
      axiosInstanceMock.post.mockResolvedValue({ data: {} });
    });

    afterEach(() => {
      axiosInstanceMock.post.mockClear();
    });

    it('calls axios.post with correct url', async () => {
      expect.assertions(1);

      const httpClient = new AxiosHttpClient();

      const fakeUrl = faker.internet.url();

      await httpClient.post(fakeUrl);

      expect(axiosInstanceMock.post).toHaveBeenCalledWith(fakeUrl, undefined, {});
    });

    it('calls axios.post with correct url and data', async () => {
      expect.assertions(1);

      const httpClient = new AxiosHttpClient();

      const fakeUrl = faker.internet.url();
      const fakeData = {
        test1: faker.datatype.string(),
        test2: faker.datatype.number(),
        test3: faker.datatype.boolean(),
      };

      await httpClient.post(fakeUrl, fakeData);

      expect(axiosInstanceMock.post).toHaveBeenCalledWith(fakeUrl, fakeData, {});
    });

    it('calls axios.post with correct url, data and options', async () => {
      expect.assertions(1);

      const httpClient = new AxiosHttpClient();

      const fakeUrl = faker.internet.url();
      const fakeData = {
        test1: faker.datatype.string(),
        test2: faker.datatype.number(),
        test3: faker.datatype.boolean(),
      };

      const fakeOptions = {
        headers: {
          test_header: 'test',
        },
        query: new URLSearchParams({ test1: 'test1', test2: 'test2' }),
      };

      await httpClient.post(fakeUrl, fakeData, fakeOptions);

      expect(axiosInstanceMock.post).toHaveBeenCalledWith(fakeUrl, fakeData, {
        params: fakeOptions.query,
        headers: fakeOptions.headers,
      });
    });

    it('returns the correct status and body after call axios.post', async () => {
      expect.assertions(2);

      const httpClient = new AxiosHttpClient();

      const fakeUrl = faker.internet.url();

      const fakeResponseBody = {
        test1: faker.datatype.string(),
        test2: faker.datatype.number(),
        test3: faker.datatype.boolean(),
        test4: faker.datatype.array(),
      };

      const fakeResponse = {
        status: 200,
        data: fakeResponseBody,
      };

      axiosInstanceMock.post.mockResolvedValueOnce(fakeResponse);

      const response = await httpClient.post<typeof fakeResponseBody>(fakeUrl);

      expect(response.status).toStrictEqual(fakeResponse.status);
      expect(response.body).toStrictEqual(fakeResponseBody);
    });

    it('throws a HttpError if axios.post returns a error', async () => {
      expect.assertions(3);

      const httpClient = new AxiosHttpClient();

      const fakeResponse = {
        response: {
          status: faker.internet.httpStatusCode(),
          data: { error: 'test' },
        },
      };

      axiosInstanceMock.post.mockRejectedValueOnce(fakeResponse);

      const fakeUrl = faker.internet.url();

      try {
        await httpClient.post(fakeUrl);
      } catch (e: any) {
        expect(e).toBeInstanceOf(HttpError);
        expect(e.statusCode).toEqual(fakeResponse.response.status);
        expect(e.body).toEqual(fakeResponse.response.data);
      }
    });

    it('throws a generic error if occur an unexpected error', async () => {
      expect.assertions(2);

      const httpClient = new AxiosHttpClient();

      axiosInstanceMock.post.mockRejectedValueOnce(new Error('test'));

      const fakeUrl = faker.internet.url();

      try {
        await httpClient.post(fakeUrl);
      } catch (e: any) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual('Unexpected error');
      }
    });
  });

  describe('AxiosHttpClient.patch()', () => {
    beforeEach(() => {
      axiosInstanceMock.patch.mockResolvedValue({ data: {} });
    });

    afterEach(() => {
      axiosInstanceMock.patch.mockClear();
    });

    it('calls axios.patch with correct url', async () => {
      expect.assertions(1);

      const httpClient = new AxiosHttpClient();

      const fakeUrl = faker.internet.url();

      await httpClient.patch(fakeUrl);

      expect(axiosInstanceMock.patch).toHaveBeenCalledWith(fakeUrl, undefined, {});
    });

    it('calls axios.patch with correct url and data', async () => {
      expect.assertions(1);

      const httpClient = new AxiosHttpClient();

      const fakeUrl = faker.internet.url();
      const fakeData = {
        test1: faker.datatype.string(),
        test2: faker.datatype.number(),
        test3: faker.datatype.boolean(),
      };

      await httpClient.patch(fakeUrl, fakeData);

      expect(axiosInstanceMock.patch).toHaveBeenCalledWith(fakeUrl, fakeData, {});
    });

    it('calls axios.patch with correct url, data and options', async () => {
      expect.assertions(1);

      const httpClient = new AxiosHttpClient();

      const fakeUrl = faker.internet.url();
      const fakeData = {
        test1: faker.datatype.string(),
        test2: faker.datatype.number(),
        test3: faker.datatype.boolean(),
      };

      const fakeOptions = {
        headers: {
          test_header: 'test',
        },
        query: new URLSearchParams({ test1: 'test1', test2: 'test2' }),
      };

      await httpClient.patch(fakeUrl, fakeData, fakeOptions);

      expect(axiosInstanceMock.patch).toHaveBeenCalledWith(fakeUrl, fakeData, {
        params: fakeOptions.query,
        headers: fakeOptions.headers,
      });
    });

    it('returns the correct status and body after call axios.patch', async () => {
      expect.assertions(2);

      const httpClient = new AxiosHttpClient();

      const fakeUrl = faker.internet.url();

      const fakeResponseBody = {
        test1: faker.datatype.string(),
        test2: faker.datatype.number(),
        test3: faker.datatype.boolean(),
        test4: faker.datatype.array(),
      };

      const fakeResponse = {
        status: 200,
        data: fakeResponseBody,
      };

      axiosInstanceMock.patch.mockResolvedValueOnce(fakeResponse);

      const response = await httpClient.patch<typeof fakeResponseBody>(fakeUrl);

      expect(response.status).toEqual(fakeResponse.status);
      expect(response.body).toEqual(fakeResponseBody);
    });

    it('throws a HttpError if axios.patch returns a error', async () => {
      expect.assertions(3);

      const httpClient = new AxiosHttpClient();

      const fakeResponse = {
        response: {
          status: faker.internet.httpStatusCode(),
          data: { error: 'test' },
        },
      };

      axiosInstanceMock.patch.mockRejectedValueOnce(fakeResponse);

      const fakeUrl = faker.internet.url();

      try {
        await httpClient.patch(fakeUrl);
      } catch (e: any) {
        expect(e).toBeInstanceOf(HttpError);
        expect(e.statusCode).toEqual(fakeResponse.response.status);
        expect(e.body).toEqual(fakeResponse.response.data);
      }
    });

    it('throws a generic error if occur an unexpected error', async () => {
      expect.assertions(2);

      const httpClient = new AxiosHttpClient();

      axiosInstanceMock.patch.mockRejectedValueOnce(new Error('test'));

      const fakeUrl = faker.internet.url();

      try {
        await httpClient.patch(fakeUrl);
      } catch (e: any) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual('Unexpected error');
      }
    });
  });

  describe('AxiosHttpClient.put()', () => {
    beforeEach(() => {
      axiosInstanceMock.put.mockResolvedValue({ data: {} });
    });

    afterEach(() => {
      axiosInstanceMock.put.mockClear();
    });

    it('calls axios.put with correct url', async () => {
      expect.assertions(1);

      const httpClient = new AxiosHttpClient();

      const fakeUrl = faker.internet.url();

      await httpClient.put(fakeUrl);

      expect(axiosInstanceMock.put).toHaveBeenCalledWith(fakeUrl, undefined, {});
    });

    it('calls axios.put with correct url and data', async () => {
      expect.assertions(1);

      const httpClient = new AxiosHttpClient();

      const fakeUrl = faker.internet.url();
      const fakeData = {
        test1: faker.datatype.string(),
        test2: faker.datatype.number(),
        test3: faker.datatype.boolean(),
      };

      await httpClient.put(fakeUrl, fakeData);

      expect(axiosInstanceMock.put).toHaveBeenCalledWith(fakeUrl, fakeData, {});
    });

    it('calls axios.put with correct url, data and options', async () => {
      expect.assertions(1);

      const httpClient = new AxiosHttpClient();

      const fakeUrl = faker.internet.url();
      const fakeData = {
        test1: faker.datatype.string(),
        test2: faker.datatype.number(),
        test3: faker.datatype.boolean(),
      };

      const fakeOptions = {
        headers: {
          test_header: 'test',
        },
        query: new URLSearchParams({ test1: 'test1', test2: 'test2' }),
      };

      await httpClient.put(fakeUrl, fakeData, fakeOptions);

      expect(axiosInstanceMock.put).toHaveBeenCalledWith(fakeUrl, fakeData, {
        params: fakeOptions.query,
        headers: fakeOptions.headers,
      });
    });

    it('returns the correct type after call axios.put', async () => {
      expect.assertions(2);

      const httpClient = new AxiosHttpClient();

      const fakeUrl = faker.internet.url();

      const fakeResponseBody = {
        test1: faker.datatype.string(),
        test2: faker.datatype.number(),
        test3: faker.datatype.boolean(),
        test4: faker.datatype.array(),
      };

      const fakeResponse = {
        status: 200,
        data: fakeResponseBody,
      };

      axiosInstanceMock.put.mockResolvedValueOnce(fakeResponse);

      const response = await httpClient.put<typeof fakeResponseBody>(fakeUrl);

      expect(response.status).toEqual(fakeResponse.status);
      expect(response.body).toEqual(fakeResponseBody);
    });

    it('throws a HttpError if axios.put returns a error', async () => {
      expect.assertions(3);

      const httpClient = new AxiosHttpClient();

      const fakeResponse = {
        response: {
          status: faker.internet.httpStatusCode(),
          data: { error: 'test' },
        },
      };

      axiosInstanceMock.put.mockRejectedValueOnce(fakeResponse);

      const fakeUrl = faker.internet.url();

      try {
        await httpClient.put(fakeUrl);
      } catch (e: any) {
        expect(e).toBeInstanceOf(HttpError);
        expect(e.statusCode).toEqual(fakeResponse.response.status);
        expect(e.body).toEqual(fakeResponse.response.data);
      }
    });

    it('throws a generic error if occur an unexpected error', async () => {
      expect.assertions(2);

      const httpClient = new AxiosHttpClient();

      axiosInstanceMock.put.mockRejectedValueOnce(new Error('test'));

      const fakeUrl = faker.internet.url();

      try {
        await httpClient.put(fakeUrl);
      } catch (e: any) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual('Unexpected error');
      }
    });
  });
});
