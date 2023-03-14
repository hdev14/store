import Entity from '@shared/abstractions/Entity';
import CPF from './CPF';

type UserParams = {
  id: string;
  name: string;
  email: string;
  document: string;
  createdAt: Date;
  password?: string;
}

export default class User extends Entity {
  public readonly name: string;

  public readonly document: CPF;

  public readonly email: string;

  public readonly createdAt: Date;

  public readonly password?: string;

  constructor(params: UserParams) {
    super(params.id);
    this.name = params.name;
    this.email = params.email;
    this.document = new CPF(params.document);
    this.createdAt = params.createdAt;
    this.password = params.password;
  }

  public validate(): boolean | void {
    throw new Error('Method not implemented.');
  }
}
