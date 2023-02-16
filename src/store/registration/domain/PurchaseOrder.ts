import Entity from '@shared/abstractions/Entity';

type PurchaseOrderParams = {
  id?: string;
  code: string;
  totalAmount: number;
  discountAmount: number;
  status: string;
  createdAt: Date;
}
export default class PurchaseOrder extends Entity {
  public readonly code: string;

  public readonly totalAmount: number;

  public readonly discountAmount: number;

  public readonly status: string;

  public readonly createdAt: Date;

  constructor(params: PurchaseOrderParams) {
    super(params.id);
    this.code = params.code;
    this.totalAmount = params.totalAmount;
    this.discountAmount = params.discountAmount;
    this.status = params.status;
    this.createdAt = params.createdAt;
  }

  public validate(): boolean | void {
    throw new Error('Method not implemented.');
  }
}
