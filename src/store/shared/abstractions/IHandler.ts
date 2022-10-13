/* eslint-disable no-unused-vars */
interface IHandler<R = any, T = {}> {
  handle(data: T): Promise<R>;
}

export default IHandler;
