import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import HttpError from './abstractions/HttpError';
import IHttpClient, { HttpBody, HttpOptions, HttpResponse } from './abstractions/IHttpClient';

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

  public async get<R = any>(url: string, options?: HttpOptions): Promise<HttpResponse<R>> {
    try {
      const config = this.getConfig(options);

      const response = await this.axiosInstance.get<R>(url, config);

      return {
        status: response.status,
        body: response.data,
      };
    } catch (e: any) {
      throw this.getError(e);
    }
  }

  public async post<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<HttpResponse<R>> {
    try {
      const config: AxiosRequestConfig = this.getConfig(options);

      const response = await this.axiosInstance.post<R>(url, data, config);

      return {
        status: response.status,
        body: response.data,
      };
    } catch (e: any) {
      throw this.getError(e);
    }
  }

  public async put<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<HttpResponse<R>> {
    try {
      const config = this.getConfig(options);

      const response = await this.axiosInstance.put<R>(url, data, config);

      return {
        status: response.status,
        body: response.data,
      };
    } catch (e: any) {
      throw this.getError(e);
    }
  }

  public async delete<R = any>(url: string, options?: HttpOptions): Promise<HttpResponse<R>> {
    try {
      const config = this.getConfig(options);

      const response = await this.axiosInstance.delete<R>(url, config);

      return {
        status: response.status,
        body: response.data,
      };
    } catch (e: any) {
      throw this.getError(e);
    }
  }

  public async patch<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<HttpResponse<R>> {
    try {
      const config: AxiosRequestConfig = this.getConfig(options);

      const response = await this.axiosInstance.patch<R>(url, data, config);

      return {
        status: response.status,
        body: response.data,
      };
    } catch (e: any) {
      throw this.getError(e);
    }
  }

  private getConfig(options?: HttpOptions) {
    const config: AxiosRequestConfig = {};

    if (options) {
      config.params = options.query;
      config.headers = options.headers;
    }

    return config;
  }

  private getError(e: any) {
    if (e.response) {
      return new HttpError(e.response.status, e.response.data, {
        cause: e.stack,
      });
    }

    return new Error('Unexpected error', { cause: e.stack });
  }
}
