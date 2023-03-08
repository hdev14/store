import Entity from '@shared/abstractions/Entity';
import CPF from './CPF';

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

  public readonly email: string;

  public readonly createdAt: Date;

  constructor(params: UserParams) {
    super(params.id);
    this.name = params.name;
    this.email = params.email;
    this.document = new CPF(params.document);
    this.createdAt = params.createdAt;
  }

  public validate(): boolean | void {
    throw new Error('Method not implemented.');
  }
}
