import DomainEvent from '@shared/abstractions/DomainEvent';

export type UpdateDraftPurchaseOrderEventData = {
  customerId: string;
  code: number;
  totalAmount: number;
  discountAmount: number;
};

// eslint-disable-next-line max-len
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
