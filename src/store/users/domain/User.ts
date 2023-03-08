import Entity from '@shared/abstractions/Entity';
import CPF from './CPF';
import Email from './Email';

type UserParams = {
  id: string;
  name: string;
  email: string;
  document: string;
  createdAt: Date;
}

export default class User extends Entity {
  public readonly name: string;

  public readonly document: CPF;

  public readonly email: Email;

  public readonly createdAt: Date;

  constructor(params: UserParams) {
    super(params.id);
    this.name = params.name;
    this.email = new Email(params.email);
    this.document = new CPF(params.document);
    this.createdAt = params.createdAt;
  }

  public validate(): boolean | void {
    throw new Error('Method not implemented.');
  }
}
