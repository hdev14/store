import Entity from '@shared/abstractions/Entity';
import DomainError from '@shared/errors/DomainError';
import Validator from '@shared/utils/Validator';
import Product, { ProductProps } from './Product';

export type PurchaseOrderItemProps = {
  id: string;
  product: ProductProps;
  quantity: number;
  purchaseOrderId?: string;
}

export default class PurchaseOrderItem extends Entity {
  public purchaseOrderId: string;

  public readonly product: Product;

  public quantity: number;

  constructor(props: PurchaseOrderItemProps) {
    super(props.id);
    this.product = new Product(props.product);
    this.quantity = props.quantity;
    this.purchaseOrderId = props.purchaseOrderId || '';

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
