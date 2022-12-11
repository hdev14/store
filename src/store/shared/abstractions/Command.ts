/* eslint-disable no-unused-vars */
import Operation from './Operation';

export default abstract class Command<Result, Data> extends Operation<Result | void, Data> {
  public async execute(data: Data): Promise<Result | void> {
    this.validate(data);

    return this.mediator.send<Result>(this.constructor.name, data);
  }

  public abstract validate(data: Data): void;
}
