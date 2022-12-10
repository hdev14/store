import Operation from './Operation';

export type Results<Result = Record<string, any>> = {
  results: Result[];
}

export default abstract class Query<Result, Data> extends Operation<Results<Result>, Data> {
  public async execute(data: Data): Promise<Results<Result>> {
    const result = await this.mediator.send<Results<Result>>(this.constructor.name, data);

    return result || { results: [] };
  }
}
