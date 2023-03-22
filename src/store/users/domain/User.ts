import Entity from '@shared/abstractions/Entity';
import Validator from '@shared/utils/Validator';
import CPF from './CPF';

export type UserProps = {
  id: string;
  name: string;
  email: string;
  document: string;
  createdAt: Date;
  password?: string;
}

export default class User extends Entity<UserProps> {
  public readonly name: string;

  public readonly document: CPF;

  public readonly email: string;

  public readonly createdAt: Date;

  public readonly password?: string;

  constructor(props: UserProps) {
    super(props.id);
    this.name = props.name;
    this.email = props.email;
    this.document = new CPF(props.document);
    this.createdAt = props.createdAt;
    this.password = props.password;
  }

  public validate(): boolean | void {
    Validator.setData(this)
      .setRule('name', ['required', 'string'])
      .setRule('email', ['required', 'string', 'email'])
      .setRule('document', () => this.document.isValid())
      .setRule('createdAt', ['required', 'date'])
      .setRule('password', ['string'])
      .validate();
  }
}
