import Entity from '@shared/abstractions/Entity';

export default class Product extends Entity {
  public name: string;

  public amount: number;

  constructor(id: string, name: string, amount: number) {
    super(id);
    this.name = name;
    this.amount = amount;
  }

  protected validate(): boolean | void {
    throw new Error('Method not implemented.');
  }
}
