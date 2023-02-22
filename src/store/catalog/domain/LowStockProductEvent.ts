import DomainEvent from '@shared/abstractions/DomainEvent';

export default class LowStockProductEvent extends DomainEvent {
  constructor(
    readonly principalId: string,
    readonly productName: string,
    readonly productQuantity: number,
  ) {
    super(principalId);
  }
}
