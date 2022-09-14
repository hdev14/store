import Event from '@shared/abstractions/Event';

export type AddPurchaseOrderItemEventData = {
  quantity: number;
  productId: string;
  productName: string;
  productAmount: number;
};

// eslint-disable-next-line max-len
export default class AddPurchaseOrderItemEvent extends Event<void, AddPurchaseOrderItemEventData> { }
