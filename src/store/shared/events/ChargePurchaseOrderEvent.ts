import Event from '@shared/abstractions/Event';

export type ChargePurchaseOrderData = {
  purchaseOrderId: string;
  customerId: string;
  purchaseOrderCode: number;
  totalAmount: number;
  cardToken: string;
  installments: number;
  items: Array<{
    itemId: string;
    productId: string;
    quantity: number;
  }>;
};

export default class ChargePurchaseOrderEvent extends Event<ChargePurchaseOrderData> { }
