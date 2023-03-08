export type HttpOptions = {
  query?: URLSearchParams;
  headers?: Record<string, string>;
}

export type HttpBody = Record<string, any> | URLSearchParams;

interface IHttpClient {
  setDefaultHeaders(headers: Record<string, string>): void;

  get<R = any>(url: string, options?: HttpOptions): Promise<R>;

  post<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<R>;

  put<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<R>;

  delete<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<R>;

  patch<R = any>(url: string, data?: HttpBody, options?: HttpOptions): Promise<R>;
};


export default IHttpClient;
