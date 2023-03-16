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

  get<R = any>(url: string, options?: HttpOptions): Promise<HttpResponse<R>>;

  post<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<HttpResponse<R>>;

  put<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<HttpResponse<R>>;

  delete<R = any>(url: string, options?: HttpOptions): Promise<HttpResponse<R>>;

  patch<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<HttpResponse<R>>;
}

export default IHttpClient;
