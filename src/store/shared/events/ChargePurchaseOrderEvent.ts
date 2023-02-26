import DomainEvent from '@shared/abstractions/DomainEvent';

export default class ChargePurchaseOrderEvent extends DomainEvent {
  constructor(
    readonly principalId: string,
    readonly customerId: string,
    readonly code: number,
    readonly totalAmount: number,
    readonly cardToken: string,
    readonly installments: number,
    readonly items: Array<{
      itemId: string
      productId: string
      quantity: number
    }>,
  ) {
    super(principalId);
  }
}
