import Entity from '@shared/abstractions/Entity';
import Validator from '@shared/utils/Validator';

export type CategoryParams = {
  id: string;
  name: string;
  code: number;
};

export default class Category extends Entity {
  public readonly name: string;

  public readonly code: number;

  constructor(params: CategoryParams) {
    super(params.id);
    this.name = params.name;
    this.code = params.code;

    this.validate();
  }

  public toString() {
    return `${this.name} - ${this.code}`;
  }

  public validate(): void {
    Validator
      .setData(this)
      .setRule('name', ['required', 'string'])
      .setRule('code', ['required', 'number', 'integer', 'min:1'])
      .validate();
  }
}
