import Entity from '@shared/abstractions/Entity';

export default class PurchaseOrder extends Entity {
  public id: string;

  public code: string;

  public totalAmount: number;

  public discountAmount: number;

  public status: string;

  public createdAt: Date;
}
