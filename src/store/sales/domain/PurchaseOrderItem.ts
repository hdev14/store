import Entity from '@shared/abstractions/Entity';
import DomainError from '@shared/errors/DomainError';
import Validator from '@shared/utils/Validator';
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

    this.validate();
  }

  public setPurchaseOrder(purchaseOrderId: string) {
    this.purchaseOrderId = purchaseOrderId;
  }

  public calculateAmount() {
    return this.quantity * this.product.amount;
  }

  public addQuantity(quantity: number) {
    if (quantity < 0) {
      throw new DomainError('Não é possível adicionar uma quantidade negativa de itens.');
    }

    this.quantity += quantity;
  }

  public updateQuantity(newQuantity: number) {
    if (newQuantity < 0) {
      throw new DomainError('Não é possível adicionar uma quantidade negativa de itens.');
    }

    this.quantity = newQuantity;
  }

  public validate(): boolean | void {
    Validator.setData(this)
      .setRule('purchaseOrderId', ['string'])
      .setRule('quantity', ['required', 'number'])
      .validate();
  }
}
