import DomainEvent from '@shared/abstractions/DomainEvent';

export default class AddPurchaseOrderItemEvent extends DomainEvent {
  constructor(
    readonly principal_id: string,
    readonly purchase_order_id: string,
    readonly quantity: number,
    readonly product_id: string,
    readonly product_name: string,
    readonly product_amount: number,
  ) {
    super(principal_id);
  }
}
