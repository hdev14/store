import Event from '@shared/abstractions/Event';

export type AddDraftPurchaseOrderEventData = {
  customerId: string;
  totalAmount: number;
  discountAmount: number;
  createdAt: Date;
  code: number;
}

// eslint-disable-next-line max-len
export default class AddDraftPurchaseOrderEvent extends Event<void, AddDraftPurchaseOrderEventData> {}
