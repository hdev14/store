interface IHandler<E = any, R = any> {
  handle(event: E): Promise<R>;
}

export default IHandler;
