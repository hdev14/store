import axios, { AxiosInstance } from "axios";
import IHttpClient, { HttpBody, HttpOptions } from "./abstractions/IHttpClient";

export default class AxiosHttpClient implements IHttpClient {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
  }

  public setDefaultHeaders(headers: Record<string, string>): void {
    throw new Error("Method not implemented.");
  }

  public async get<R = any>(url: string, options?: HttpOptions): Promise<R> {
    throw new Error("Method not implemented.");
  }

  public async post<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<R> {
    throw new Error("Method not implemented.");
  }

  public async put<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<R> {
    throw new Error("Method not implemented.");
  }

  public async delete<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<R> {
    throw new Error("Method not implemented.");
  }

  public async patch<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<R> {
    throw new Error("Method not implemented.");
  }
}
