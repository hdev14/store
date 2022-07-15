import uuid from 'uuid';
import Entity from '../shared/abstractions/Entity';
import EntityValidator from '../shared/utils/EntityValidator';

export default class Category extends Entity {
  public name: string;

  public code: number;

  constructor(name: string, code: number) {
    super(uuid.v4());
    this.name = name;
    this.code = code;

    this.validate();
  }

  toString() {
    return `${this.name} - ${this.code}`;
  }

  protected validate(): void {
    EntityValidator
      .setData(this)
      .setRule('name', ['required'])
      .setRule('code', ['required', 'min:1'])
      .validate();
  }
}
