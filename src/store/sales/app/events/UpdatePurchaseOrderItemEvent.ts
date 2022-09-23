import Event from '@shared/abstractions/Event';

export type UpdatePurchaserOrderItemEventData = {
  quantity: number;
}

// eslint-disable-next-line max-len
export default class UpdatePurchaseOrderItemEvent extends Event<void, UpdatePurchaserOrderItemEventData> {}
