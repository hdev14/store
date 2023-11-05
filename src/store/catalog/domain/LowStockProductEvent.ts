import DomainEvent from '@shared/abstractions/DomainEvent';

export default class LowStockProductEvent extends DomainEvent {
  constructor(
    readonly principal_id: string,
    readonly product_name: string,
    readonly product_quantity: number,
  ) {
    super(principal_id);
  }
}
