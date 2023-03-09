import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import HttpError from './abstractions/HttpError';
import IHttpClient, { HttpBody, HttpOptions } from './abstractions/IHttpClient';

export default class AxiosHttpClient implements IHttpClient {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
  }

  public setDefaultHeaders(headers: Record<string, string>): void {
    const headerKeys = Object.keys(headers);

    headerKeys.forEach((headerKey) => {
      this.axiosInstance.defaults.headers.common[headerKey] = headers[headerKey];
    });
  }

  public async get<R = any>(url: string, options?: HttpOptions): Promise<R> {
    try {
      const config: AxiosRequestConfig = {};

      if (options) {
        config.params = options.query;
        config.headers = options.headers;
      }

      const response = await this.axiosInstance.get<R>(url, config);

      return response.data;
    } catch (e: any) {
      if (e.response) {
        throw new HttpError(e.response.status, e.response.data, {
          cause: e.stack,
        });
      }

      throw new Error('Unexpected error', { cause: e.stack });
    }
  }

  public async post<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<R> {
    throw new Error('Method not implemented.');
  }

  public async put<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<R> {
    throw new Error('Method not implemented.');
  }

  public async delete<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<R> {
    throw new Error('Method not implemented.');
  }

  public async patch<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<R> {
    throw new Error('Method not implemented.');
  }
}
