import Entity from '@shared/abstractions/Entity';
import Validator from '@shared/utils/Validator';
import CPF from './CPF';

export type UserProps = {
  id: string;
  name: string;
  email: string;
  document: string;
  created_at: Date;
  password?: string;
}

export default class User extends Entity<UserProps> {
  public readonly name: string;

  public readonly document: CPF;

  public readonly email: string;

  public readonly created_at: Date;

  public readonly password?: string;

  constructor(props: UserProps) {
    super(props.id);
    this.name = props.name;
    this.email = props.email;
    this.document = new CPF(props.document);
    this.created_at = props.created_at;
    this.password = props.password;

    this.validate();
  }

  public validate(): boolean | void {
    Validator.setData(this)
      .setRule('name', ['required', 'string'])
      .setRule('email', ['required', 'string', 'email'])
      .setRule('document', () => this.document.isValid())
      .setRule('created_at', ['date'])
      .setRule('password', ['string', 'min:6'])
      .validate();
  }

  public toObject(): UserProps {
    const data = {
      ...this,
      document: this.document.value,
      password: undefined,
    };

    return this.transformToObject(data);
  }
}
