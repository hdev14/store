/* eslint-disable no-shadow */
import Entity from '@shared/abstractions/Entity';
import IAggregateRoot from '@shared/abstractions/IAggregateRoot';
import DomainError from '@shared/errors/DomainError';
import Validator from '@shared/utils/Validator';
import PurchaseOrderItem, { PurchaseOrderItemProps } from './PurchaseOrderItem';
import Voucher, { VoucherDiscountTypes, VoucherProps } from './Voucher';

export enum PurchaseOrderStatus {
  DRAFT = 'draft',
  STARTED = 'started',
  PAID = 'paid',
  SHIPPED = 'shipped',
  CANCELED = 'canceled',
}

export type PurchaseOrderProps = {
  id: string;
  customer_id: string;
  code: number;
  created_at: Date;
  voucher: VoucherProps | null;
  discount_amount?: number;
  total_amount?: number;
  status: PurchaseOrderStatus | null;
  items: Array<PurchaseOrderItemProps>;
}

export default class PurchaseOrder extends Entity<PurchaseOrderProps> implements IAggregateRoot {
  public readonly code: number;

  public readonly customer_id: string;

  public voucher: Voucher | null;

  public discount_amount: number;

  public total_amount: number;

  public readonly created_at: Date;

  public status: PurchaseOrderStatus;

  private _items: Array<PurchaseOrderItem> = [];

  constructor(props: PurchaseOrderProps) {
    super(props.id);
    this.customer_id = props.customer_id;
    this.created_at = props.created_at;
    this.code = props.code;
    this.voucher = props.voucher ? new Voucher(props.voucher) : null;
    this.total_amount = props.total_amount || 0;
    this.discount_amount = props.discount_amount || 0;
    this.status = props.status || PurchaseOrderStatus.DRAFT;
    for (const itemProps of props.items) {
      this._items.push(new PurchaseOrderItem(itemProps));
    }

    this.validate();
  }

  public static createDraft(props: PurchaseOrderProps) {
    return new PurchaseOrder(props);
  }

  get items() {
    return this._items;
  }

  public addItem(item: PurchaseOrderItem) {
    item.setPurchaseOrder(this.id);

    if (this.hasItem(item)) {
      const index = this._items.findIndex((i) => i.product.id === item.product.id);
      const currentItem = this._items[index];

      item.addQuantity(currentItem.quantity);
      this._items = this._items.filter((_, idx) => idx !== index);
    }

    this._items.push(item);
    this.calculateTotalAmount();
  }

  public removeItem(item: PurchaseOrderItem) {
    const exists = this._items.some((i) => i.id === item.id);

    if (!exists) {
      throw new DomainError('Item do pedido não encontrado.');
    }

    this._items = this._items.filter((i) => i.id !== item.id);

    this.calculateTotalAmount();
  }

  public updateItemQuantity(itemId: string, quantity: number) {
    const index = this._items.findIndex((i) => i.id === itemId);

    if (index === -1) {
      throw new DomainError('Item do pedido não encontrado.');
    }

    this._items[index].updateQuantity(quantity);

    this.calculateTotalAmount();
  }

  public applyVoucher(voucher: Voucher) {
    this.voucher = voucher;
    this.calculateTotalDiscountAmount();
  }

  public calculateTotalAmount() {
    this.total_amount = this._items.reduce((acc, item) => acc + item.calculateAmount(), 0);
    this.calculateTotalDiscountAmount();
  }

  public calculateTotalDiscountAmount() {
    if (!this.voucher) {
      return;
    }

    if (this.voucher.type === VoucherDiscountTypes.PERCENTAGE) {
      this.discount_amount = (this.total_amount * this.voucher.percentage_amount) / 100;
      this.total_amount -= this.discount_amount;
    } else {
      this.discount_amount = this.voucher.raw_discount_amount;
      this.total_amount -= this.discount_amount;
    }

    this.total_amount = this.total_amount < 0 ? 0 : this.total_amount;
  }

  public hasItem(item: PurchaseOrderItem) {
    return this._items.some((i) => i.product.id === item.product.id);
  }

  public makeDraft() {
    this.status = PurchaseOrderStatus.DRAFT;
  }

  public start() {
    this.status = PurchaseOrderStatus.STARTED;
  }

  public finish() {
    this.status = PurchaseOrderStatus.PAID;
  }

  public cancel() {
    this.status = PurchaseOrderStatus.CANCELED;
  }

  public validate(): boolean | void {
    Validator.setData(this)
      .setRule('code', ['number', 'integer'])
      .setRule('customer_id', ['required', 'string', 'uuid'])
      .setRule('discount_amount', ['number'])
      .setRule('total_amount', ['number'])
      .setRule('status', ['required', 'string'])
      .validate();
  }
}
