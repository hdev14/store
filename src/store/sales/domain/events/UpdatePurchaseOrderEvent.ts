import DomainEvent from '@shared/abstractions/DomainEvent';
import { PurchaseOrderStatus } from '../PurchaseOrder';
import PurchaseOrderItem from '../PurchaseOrderItem';
import Voucher from '../Voucher';

export default class UpdatePurchaseOrderEvent extends DomainEvent {
  constructor(
    readonly principal_id: string,
    readonly customer_id: string,
    readonly code: number,
    readonly created_at: Date,
    readonly status: PurchaseOrderStatus,
    readonly total_amount: number,
    readonly discount_amount: number,
    readonly voucher: Voucher | null,
    readonly items: Array<PurchaseOrderItem>,
  ) {
    super(principal_id);
  }
}
