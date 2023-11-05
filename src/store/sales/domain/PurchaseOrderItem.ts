import Entity from '@shared/abstractions/Entity';
import DomainError from '@shared/errors/DomainError';
import Validator from '@shared/utils/Validator';
import Product, { ProductProps } from './Product';

export type PurchaseOrderItemProps = {
  id: string;
  product: ProductProps;
  quantity: number;
  purchase_order_id?: string;
}

export default class PurchaseOrderItem extends Entity<PurchaseOrderItemProps> {
  public purchase_order_id: string;

  public readonly product: Product;

  public quantity: number;

  constructor(props: PurchaseOrderItemProps) {
    super(props.id);
    this.product = new Product(props.product);
    this.quantity = props.quantity;
    this.purchase_order_id = props.purchase_order_id || '';

    this.validate();
  }

  public setPurchaseOrder(purchaseOrderId: string) {
    this.purchase_order_id = purchaseOrderId;
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

  public updateQuantity(new_quantity: number) {
    if (new_quantity < 0) {
      throw new DomainError('Não é possível adicionar uma quantidade negativa de itens.');
    }

    this.quantity = new_quantity;
  }

  public validate(): boolean | void {
    Validator.setData(this)
      .setRule('purchase_order_id', ['string'])
      .setRule('quantity', ['required', 'number'])
      .validate();
  }
}
