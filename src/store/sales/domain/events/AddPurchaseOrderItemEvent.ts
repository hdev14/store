import DomainEvent from '@shared/abstractions/DomainEvent';

// eslint-disable-next-line max-len
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
