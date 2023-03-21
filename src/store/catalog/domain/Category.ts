import Entity from '@shared/abstractions/Entity';
import Validator from '@shared/utils/Validator';

export type CategoryProps = {
  id: string;
  name: string;
  code: number;
};

export default class Category extends Entity<CategoryProps> {
  public readonly name: string;

  public readonly code: number;

  constructor(props: CategoryProps) {
    super(props.id);
    this.name = props.name;
    this.code = props.code;

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
