import Entity from '@shared/abstractions/Entity';
import Product from './Product';

export type PurchaseOrderItemParams = {
  id: string;
  product: Product;
  quantity: number;
  purchaseOrderId?: string;
}

export default class PurchaseOrderItem extends Entity {
  public purchaseOrderId: string;

  public product: Product;

  public quantity: number;

  constructor(params: PurchaseOrderItemParams) {
    super(params.id);
    this.product = params.product;
    this.quantity = params.quantity;
    this.purchaseOrderId = params.purchaseOrderId || '';
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

  public validate(): boolean | void {
    throw new Error('Method not implemented.');
  }
}
