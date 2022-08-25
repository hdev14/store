import Entity from '@shared/abstractions/Entity';
import Product from './Product';

export type PurchaseOrderItemParams = {
  id: string;
  purchaseOrderId: string;
  product: Product;
  quantity: number;
}

export default class PurchaseOrderItem extends Entity {
  public purchaseOrderId: string;

  public product: Product;

  public quantity: number;

  constructor(params: PurchaseOrderItemParams) {
    super(params.id);
    this.purchaseOrderId = params.purchaseOrderId;
    this.product = params.product;
    this.quantity = params.quantity;
  }

  public setPurchaseOrder(purchaseOrderId: string) {
    this.purchaseOrderId = purchaseOrderId;
  }

  public calculateAmount() {
    return this.quantity * this.product.amount;
  }

  public addQuantity(quantity: number) {
    this.quantity += quantity;
  }

  public updateQuantity(newQuantity: number) {
    this.quantity = newQuantity;
  }

  protected validate(): boolean | void {
    throw new Error('Method not implemented.');
  }
}
