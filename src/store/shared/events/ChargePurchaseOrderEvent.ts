import Event from '@shared/abstractions/Event';

export default class ChargePurchaseOrderEvent extends Event {
  constructor(
    readonly id: string,
    readonly customerId: string,
    readonly code: number,
    readonly totalAmount: number,
    readonly cardToken: string,
    readonly installments: number,
    readonly items: Array<{
      id: string
      productId: string
      quantity: number
    }>,
  ) {
    super();
  }
}
