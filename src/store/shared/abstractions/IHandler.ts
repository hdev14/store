interface IHandler<E = any, R = any> {
  /** @throws {EventHandlerError} */
  handle(event: E): Promise<R>;
}

export default IHandler;
