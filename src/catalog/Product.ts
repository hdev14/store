import uuid from 'uuid';
import Entity from '../shared/abstractions/Entity';
import IAggregateRoot from '../shared/abstractions/IAggregateRoot';
import Category from './Category';

export default class Product extends Entity implements IAggregateRoot {
  public name: string;

  public description: string;

  public active: boolean;

  public amount: number;

  public createdAt: Date;

  public image: string;

  public stockQuantity: number;

  public category: Category;

  constructor(
    name: string,
    description: string,
    active: boolean,
    amount: number,
    image: string,
    stockQuantity: number,
    createdAt: Date,
  ) {
    super(uuid.v4());
    this.name = name;
    this.description = description;
    this.amount = amount;
    this.image = image;
    this.stockQuantity = stockQuantity;
    this.createdAt = createdAt;
  }

  validate(): boolean {
    return !!this;
  }
}
