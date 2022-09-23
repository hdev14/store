import Event from '@shared/abstractions/Event';

export type AddPurchaseOrderItemEventData = {
  purchaseOrderId: string;
  quantity: number;
  productId: string;
};

// eslint-disable-next-line max-len
export default class AddPurchaseOrderItemEvent extends Event<void, AddPurchaseOrderItemEventData> { }
