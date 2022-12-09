import Event from '@shared/abstractions/Event';

export type RemovePurchaseOrderItemEventData = {
    purchaseOrderItemId: string;
}

// eslint-disable-next-line max-len
export default class RemovePurchaseOrderItemEvent extends Event<RemovePurchaseOrderItemEventData> {}
