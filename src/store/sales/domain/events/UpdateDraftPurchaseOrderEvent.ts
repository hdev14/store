import DomainEvent from '@shared/abstractions/DomainEvent';

export default class UpdateDraftPurchaseOrderEvent extends DomainEvent {
  constructor(
    readonly principal_id: string,
    readonly customer_id: string,
    readonly code: number,
    readonly total_amount: number,
    readonly discount_amount: number,
  ) {
    super(principal_id);
  }
}
