import Event from '@shared/abstractions/Event';

export type AddDraftPurchaseOrderEventData = {
  purchaseOrderItemId: string;
}

// eslint-disable-next-line max-len
export default class AddDraftPurchaseOrderEvent extends Event<void, AddDraftPurchaseOrderEventData> {}
