import Event from '@shared/abstractions/Event';

export type UpdatePurchaserOrderItemEventData = {
  productId: string;
  productName: string;
  productAmount: number;
  quantity: number;
}

// eslint-disable-next-line max-len
export default class UpdatePurchaseOrderItemEvent extends Event<void, UpdatePurchaserOrderItemEventData> {}
