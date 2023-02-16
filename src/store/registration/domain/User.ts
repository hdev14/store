import Entity from '@shared/abstractions/Entity';
import IAggregateRoot from '@shared/abstractions/IAggregateRoot';
import PurchaseOrder from './PurchaseOrder';

type UserParams = {
  id?: string;
  name: string;
  email: string;
  purchaseOrders: PurchaseOrder[];
  createdAt: Date;
}

export default class User extends Entity implements IAggregateRoot {
  public readonly name: string;

  public readonly email: string;

  public readonly purchaseOrders: PurchaseOrder[];

  public readonly createdAt: Date;

  constructor(params: UserParams) {
    super(params.id);
    this.name = params.name;
    this.email = params.email;
    this.purchaseOrders = params.purchaseOrders;
    this.createdAt = params.createdAt;
  }

  public validate(): boolean | void {
    throw new Error('Method not implemented.');
  }
}
