import DomainEvent from '@shared/abstractions/DomainEvent';

export default class AddDraftPurchaseOrderEvent extends DomainEvent {
  constructor(
    readonly principal_id: string,
    readonly customer_id: string,
    readonly total_amount: number,
    readonly discount_amount: number,
    readonly created_at: Date,
    readonly code: number,
  ) {
    super(principal_id);
  }
}
