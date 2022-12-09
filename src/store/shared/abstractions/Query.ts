import Mediator from './Mediator';

export type Results<D = Record<string, any>> = {
  results: D[];
}

export default abstract class Query<D, P = {}> {
  protected readonly mediator: Mediator;

  constructor(mediator: Mediator) {
    this.mediator = mediator;
  }

  public async get(params: P): Promise<Results<D>> {
    const result = await this.mediator.send<Results<D>>(this.constructor.name, params);

    return result || { results: [] };
  }
}
