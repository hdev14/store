import uuid from 'uuid';
import Entity from '../shared/abstractions/Entity';
import IAggregateRoot from '../shared/abstractions/IAggregateRoot';
import EntityValidator from '../shared/utils/EntityValidator';
import Category from './Category';

export default class Product extends Entity implements IAggregateRoot {
  public name: string;

  public description: string;

  public active: boolean = false;

  public amount: number;

  public createdAt: Date;

  public image: string;

  public stockQuantity: number;

  public category?: Category;

  constructor(
    name: string,
    description: string,
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

    this.validate();
  }

  activeProduct() {
    this.active = true;
  }

  deactiveProduct() {
    this.active = false;
  }

  changeCategory(category: Category) {
    this.category = category;
  }

  changeDescription(description: string) {
    this.description = description;
  }

  removeFromStock(quantity: number) {
    this.stockQuantity -= Math.abs(quantity);
  }

  addToStock(quantity: number) {
    this.stockQuantity += quantity;
  }

  hasStockFor(quantity: number) {
    return this.stockQuantity >= quantity;
  }

  protected validate(): void {
    EntityValidator
      .setData(this)
      .setRule('name', ['required'])
      .setRule('description', ['required'])
      .setRule('category', ['required'])
      .setRule('amount', ['required', 'min:0'])
      .setRule('image', ['required'])
      .validate();
  }
}
