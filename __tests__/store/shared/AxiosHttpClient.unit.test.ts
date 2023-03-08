import axios from 'axios';
import AxiosHttpClient from '@shared/AxiosHttpClient';

jest.mock('axios');

const axiosMocked = jest.mocked(axios);

describe("AxiosHttpClient's unit tests", () => {
  it('creates a new instance of axios', () => {
    new AxiosHttpClient();

    expect(axiosMocked.create).toHaveBeenCalled();
  });
});
