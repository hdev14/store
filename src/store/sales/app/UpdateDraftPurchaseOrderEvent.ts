import Event from '@shared/abstractions/Event';

export type UpdateDraftPurchaseOrderEventData = {
  purchaseOrderItemId: string;
  purchaseOrderQuantity: number;
  productId: string;
};

// eslint-disable-next-line max-len
export default class UpdateDraftPurchaseOrderEvent extends Event<void, UpdateDraftPurchaseOrderEventData> { }
