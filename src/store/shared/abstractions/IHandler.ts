interface IHandler<R = any, T = object> {
  handle(data: T): Promise<R>;
}

export default IHandler;
