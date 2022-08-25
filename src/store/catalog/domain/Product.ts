import Entity from '@shared/abstractions/Entity';
import IAggregateRoot from '@shared/abstractions/IAggregateRoot';
import EntityValidator from '@shared/utils/EntityValidator';
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

  public activeProduct() {
    this.active = true;
  }

  public deactiveProduct() {
    this.active = false;
  }

  public changeCategory(category: Category) {
    this.category = category;
  }

  public changeDescription(description: string) {
    this.description = description;
  }

  public removeFromStock(quantity: number) {
    this.stockQuantity -= Math.abs(quantity);
  }

  public addToStock(quantity: number) {
    this.stockQuantity += quantity;
  }

  public hasStockFor(quantity: number) {
    return this.stockQuantity >= quantity;
  }

  public validate(): void {
    EntityValidator
      .setData({ ...this, ...this.dimensions })
      .setRule('name', ['required', 'string'])
      .setRule('description', ['required', 'string'])
      .setRule('category', ['required'])
      .setRule('amount', ['required', 'number', 'min:0'])
      .setRule('image', ['required', 'string', 'url'])
      .setRule('stockQuantity', ['required', 'number', 'integer', 'min:0'])
      .setRule('height', ['required', 'number', 'min:0'])
      .setRule('depth', ['required', 'number', 'min:0'])
      .setRule('width', ['required', 'number', 'min:0'])
      .validate();
  }
}
