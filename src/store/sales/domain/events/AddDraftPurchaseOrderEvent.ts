import DomainEvent from '@shared/abstractions/DomainEvent';

export default class AddDraftPurchaseOrderEvent extends DomainEvent {
  constructor(
    readonly principalId: string,
    readonly customerId: string,
    readonly totalAmount: number,
    readonly discountAmount: number,
    readonly createdAt: Date,
    readonly code: number,
  ) {
    super(principalId);
  }
}
