import uuid from 'uuid';
import Entity from '../shared/abstractions/Entity';
import EntityValidator from '../shared/utils/EntityValidator';

export default class Category extends Entity {
  private _name: string;

  private _code: number;

  constructor(name: string, code: number) {
    super(uuid.v4());
    this._name = name;
    this._code = code;

    this.validate();
  }

  get name() {
    return this._name;
  }

  get code() {
    return this._code;
  }

  toString() {
    return `${this._name} - ${this._code}`;
  }

  validate(): void {
    EntityValidator
      .setData(this.toObject())
      .setRule('name', ['required'])
      .setRule('code', ['required', 'min:1'])
      .validate();
  }
}
