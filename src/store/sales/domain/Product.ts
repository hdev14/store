import Entity from '@shared/abstractions/Entity';
import Validator from '@shared/utils/Validator';

export default class Product extends Entity {
  public readonly name: string;

  public readonly amount: number;

  constructor(id: string, name: string, amount: number) {
    super(id);
    this.name = name;
    this.amount = amount;

    this.validate();
  }

  public validate(): boolean | void {
    Validator.setData(this)
      .setRule('id', ['required', 'string'])
      .setRule('name', ['required', 'string'])
      .setRule('amount', ['required', 'number'])
      .validate();
  }
}
