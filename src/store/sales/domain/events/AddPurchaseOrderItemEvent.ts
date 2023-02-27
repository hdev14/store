import DomainEvent from '@shared/abstractions/DomainEvent';

export default class AddPurchaseOrderItemEvent extends DomainEvent {
  constructor(
    readonly principalId: string,
    readonly purchaseOrderId: string,
    readonly quantity: number,
    readonly productId: string,
    readonly productName: string,
    readonly productAmount: number,
  ) {
    super(principalId);
  }
}
