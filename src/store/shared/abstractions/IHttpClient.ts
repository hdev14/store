export type HttpOptions = {
  query?: URLSearchParams;
  headers?: Record<string, string>;
}

export type HttpBody = Record<string, any> | URLSearchParams;

export type HttpResponse<T = Record<string, any> | Array<any>> = {
  status: number;
  body: T;
}

interface IHttpClient {
  setDefaultHeaders(headers: Record<string, string>): void;

  /** @throws {HttpError} */
  get<R = any>(url: string, options?: HttpOptions): Promise<HttpResponse<R>>;

  /** @throws {HttpError} */
  post<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<HttpResponse<R>>;

  /** @throws {HttpError} */
  put<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<HttpResponse<R>>;

  /** @throws {HttpError} */
  delete<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<HttpResponse<R>>;

  /** @throws {HttpError} */
  patch<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<HttpResponse<R>>;
}

export default IHttpClient;
