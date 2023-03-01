interface IEventWorker<Params extends Array<any>> {
  process(...params: Params): Promise<void>;
}

export default IEventWorker;
