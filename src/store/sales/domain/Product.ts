import Entity from '@shared/abstractions/Entity';
import Validator from '@shared/utils/Validator';

export default class Product extends Entity {
  public name: string;

  public amount: number;

  constructor(id: string, name: string, amount: number) {
    super(id);
    this.name = name;
    this.amount = amount;

    this.validate();
  }

  public validate(): boolean | void {
    Validator.setData(this)
      .setRule('id', ['string', 'required'])
      .setRule('name', ['string', 'required'])
      .setRule('amount', ['number', 'float', 'required'])
      .validate();
  }
}
