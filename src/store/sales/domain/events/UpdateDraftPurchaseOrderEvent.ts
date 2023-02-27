import DomainEvent from '@shared/abstractions/DomainEvent';

export default class UpdateDraftPurchaseOrderEvent extends DomainEvent {
  constructor(
    readonly principalId: string,
    readonly customerId: string,
    readonly code: number,
    readonly totalAmount: number,
    readonly discountAmount: number,
  ) {
    super(principalId);
  }
}
