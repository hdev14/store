/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import Entity from '@shared/abstractions/Entity';
import IAggregateRoot from '@shared/abstractions/IAggregateRoot';
import DomainError from '@shared/errors/DomainError';
import Validator from '@shared/utils/Validator';
import PurchaseOrderItem from './PurchaseOrderItem';
import Voucher, { VoucherDiscountTypes } from './Voucher';

export enum PurchaseOrderStatus {
  DRAFT = 'draft',
  STARTED = 'started',
  PAID = 'paid',
  SHIPPED = 'shipped',
  CANCELED = 'canceled',
}

export type PurchaseOrderParams = {
  id: string;
  customerId: string;
  code: number;
  createdAt: Date;
  voucher: Voucher | null;
  discountAmount?: number;
  totalAmount?: number;
  status: PurchaseOrderStatus | null;
}

export default class PurchaseOrder extends Entity implements IAggregateRoot {
  public code: number;

  public customerId: string;

  public voucher: Voucher | null;

  public discountAmount: number;

  public totalAmount: number;

  public createdAt: Date;

  public status: PurchaseOrderStatus;

  private _items: Array<PurchaseOrderItem>;

  constructor(params: PurchaseOrderParams) {
    super(params.id);
    this.customerId = params.customerId;
    this.createdAt = params.createdAt;
    this.code = params.code;
    this.voucher = params.voucher;
    this.totalAmount = params.totalAmount || 0;
    this.discountAmount = params.discountAmount || 0;
    this.status = params.status || PurchaseOrderStatus.DRAFT;
    this._items = [];

    this.validate();
  }

  public static createDraft(params: PurchaseOrderParams) {
    return new PurchaseOrder(params);
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
    this.totalAmount = this._items.reduce((acc, item) => acc + item.calculateAmount(), 0);
    this.calculateTotalDiscountAmount();
  }

  public calculateTotalDiscountAmount() {
    if (!this.voucher) {
      return;
    }

    if (this.voucher.type === VoucherDiscountTypes.PERCENTAGE) {
      this.discountAmount = (this.totalAmount * this.voucher.percentageAmount) / 100;
      this.totalAmount -= this.discountAmount;
    } else {
      this.discountAmount = this.voucher.rawDiscountAmount;
      this.totalAmount -= this.discountAmount;
    }

    this.totalAmount = this.totalAmount < 0 ? 0 : this.totalAmount;
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
      .setRule('customerId', ['required', 'string', 'uuid'])
      .setRule('discountAmount', ['number'])
      .setRule('totalAmount', ['number'])
      .setRule('status', ['required', 'string'])
      .validate();
  }
}
