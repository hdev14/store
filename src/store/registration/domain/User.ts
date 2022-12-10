import Entity from '@shared/abstractions/Entity';
import IAggregateRoot from '@shared/abstractions/IAggregateRoot';
import PurchaseOrder from './PurchaseOrder';

export default class User extends Entity implements IAggregateRoot {
  public id: string;

  public name: string;

  public email: string;

  public purchaseOrders: PurchaseOrder[];

  public createdAt: Date;

  public validate(): boolean | void {
    throw new Error('Method not implemented.');
  }
}
