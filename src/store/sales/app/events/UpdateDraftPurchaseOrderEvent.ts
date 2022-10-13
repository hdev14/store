import Event from '@shared/abstractions/Event';

export type UpdateDraftPurchaseOrderEventData = {
  customerId: string;
  code: number;
  totalAmount: number;
  discountAmount: number;
};

// eslint-disable-next-line max-len
export default class UpdateDraftPurchaseOrderEvent extends Event<UpdateDraftPurchaseOrderEventData> { }
