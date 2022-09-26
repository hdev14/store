import Event from '@shared/abstractions/Event';

export type UpdatePurchaserOrderItemEventData = {
  quantity: number;
  productId: string;
  productName: string;
  productAmount: number;
}

// eslint-disable-next-line max-len
export default class UpdatePurchaseOrderItemEvent extends Event<void, UpdatePurchaserOrderItemEventData> {}
