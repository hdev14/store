/* eslint-disable no-unused-vars */
import Mediator from './Mediator';

export default abstract class Operation<Result, Data = {}> {
  protected readonly mediator: Mediator;

  constructor(mediator: Mediator) {
    this.mediator = mediator;
  }

  public abstract execute(data: Data): Promise<Result>;
}
