import Entity from '@shared/abstractions/Entity';
import IAggregateRoot from '@shared/abstractions/IAggregateRoot';
import Validator from '@shared/utils/Validator';
import Category, { CategoryProps } from './Category';
import Dimensions, { DimensionsProps } from './Dimensions';

export type ProductProps = {
  id: string;
  name: string;
  description: string;
  amount: number;
  image: string;
  stockQuantity: number;
  createdAt: Date;
  dimensions: DimensionsProps;
  category: CategoryProps;
}

export default class Product extends Entity<ProductProps> implements IAggregateRoot {
  public readonly name: string;

  public description: string;

  public active = false;

  public readonly amount: number;

  public readonly createdAt: Date;

  public readonly image: string;

  public stockQuantity: number;

  public category: Category;

  public readonly dimensions: Dimensions;

  constructor(props: ProductProps) {
    super(props.id);
    this.name = props.name;
    this.description = props.description;
    this.amount = props.amount;
    this.image = props.image;
    this.stockQuantity = props.stockQuantity;
    this.createdAt = props.createdAt;
    this.dimensions = new Dimensions(props.dimensions);
    this.category = new Category(props.category);

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
    Validator
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
