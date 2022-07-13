import uuid from 'uuid';
import Entity from '../shared/abstractions/Entity';
import IAggregateRoot from '../shared/abstractions/IAggregateRoot';
import Category from './Category';

export default class Product extends Entity implements IAggregateRoot {
  private _name: string;

  private _description: string;

  private _active: boolean;

  private _amount: number;

  private _createdAt: Date;

  private _image: string;

  private _stockQuantity: number;

  private _category: Category;

  constructor(
    name: string,
    description: string,
    amount: number,
    image: string,
    stockQuantity: number,
    createdAt: Date,
  ) {
    super(uuid.v4());
    this._name = name;
    this._description = description;
    this._amount = amount;
    this._image = image;
    this._stockQuantity = stockQuantity;
    this._createdAt = createdAt;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get active() {
    return this._active;
  }

  get amount() {
    return this._amount;
  }

  get createdAt() {
    return this._createdAt;
  }

  get image() {
    return this._image;
  }

  get stockQuantity() {
    return this._stockQuantity;
  }

  get category() {
    return this._category;
  }

  validate(): boolean {
    return !!this;
  }
}
