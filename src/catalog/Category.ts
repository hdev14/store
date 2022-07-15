import Entity from '../shared/abstractions/Entity';
import EntityValidator from '../shared/utils/EntityValidator';

type CategoryParams = {
  id: string;
  name: string;
  code: number;
};

export default class Category extends Entity {
  public name: string;

  public code: number;

  constructor(params: CategoryParams) {
    super(params.id);
    this.name = params.name;
    this.code = params.code;

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
