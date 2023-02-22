import DomainEvent from '@shared/abstractions/DomainEvent';

export type UpdatePurchaserOrderItemEventData = {
  quantity: number;
  productId: string;
  productName: string;
  productAmount: number;
}

// eslint-disable-next-line max-len
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
