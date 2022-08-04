import Entity from 'src/store/shared/abstractions/Entity';
import IAggregateRoot from 'src/store/shared/abstractions/IAggregateRoot';
import EntityValidator from 'src/store/shared/utils/EntityValidator';
import Category from './Category';
import Dimensions from './Dimensions';

export type ProductParams = {
  id: string;
  name: string;
  description: string;
  amount: number;
  image: string;
  stockQuantity: number;
  createdAt: Date;
  dimensions: Dimensions;
  category: Category;
}

export default class Product extends Entity implements IAggregateRoot {
  public name: string;

  public description: string;

  public active: boolean = false;

  public amount: number;

  public createdAt: Date;

  public image: string;

  public stockQuantity: number;

  public category: Category;

  public dimensions: Dimensions;

  constructor(params: ProductParams) {
    super(params.id);
    this.name = params.name;
    this.description = params.description;
    this.amount = params.amount;
    this.image = params.image;
    this.stockQuantity = params.stockQuantity;
    this.createdAt = params.createdAt;
    this.dimensions = params.dimensions;
    this.category = params.category;

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
      .setRule('image', ['required', 'url'])
      .setRule('stockQuantity', ['required', 'min:0'])
      .validate();
  }
}
