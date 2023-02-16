import Mediator from './Mediator';

export default abstract class Operation<Result, Data = object> {
  constructor(protected readonly mediator: Mediator) { }

  public abstract execute(data: Data): Promise<Result>;
}
