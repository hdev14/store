import Entity from '@shared/abstractions/Entity';
import Validator from '@shared/utils/Validator';

export type ProductProps = {
  id: string;
  name: string;
  amount: number;
};

export default class Product extends Entity {
  public readonly name: string;

  public readonly amount: number;

  constructor(props: ProductProps) {
    super(props.id);
    this.name = props.name;
    this.amount = props.amount;

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
