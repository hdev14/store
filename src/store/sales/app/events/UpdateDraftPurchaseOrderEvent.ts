import Event from '@shared/abstractions/Event';

export type UpdateDraftPurchaseOrderEventData = {
  purchaseOrderItemIds: string[];
  totalAmount: number;
  discountAmount: number;
};

// eslint-disable-next-line max-len
export default class UpdateDraftPurchaseOrderEvent extends Event<void, UpdateDraftPurchaseOrderEventData> { }
