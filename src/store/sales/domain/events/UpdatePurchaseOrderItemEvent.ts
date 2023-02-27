import DomainEvent from '@shared/abstractions/DomainEvent';

export default class UpdatePurchaseOrderItemEvent extends DomainEvent {
  constructor(
    readonly principalId: string,
    readonly quantity: number,
    readonly productId: string,
    readonly productName: string,
    readonly productAmount: number,
  ) {
    super(principalId);
  }
}
