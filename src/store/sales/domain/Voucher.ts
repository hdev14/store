import Entity from '@shared/abstractions/Entity';
import Validator from '@shared/utils/Validator';

/* eslint-disable no-shadow */
export enum VoucherDiscountTypes {
  PERCENTAGE,
  ABSOLUTE
}

export type VoucherParams = {
  id: string;
  code: number;
  percentageAmount: number;
  rawDiscountAmount: number;
  quantity: number;
  type: VoucherDiscountTypes;
  createdAt: Date;
  expiresAt: Date;
  active: boolean;
  usedAt: Date | null;
}

export default class Voucher extends Entity {
  public readonly code: number;

  public readonly percentageAmount: number;

  public readonly rawDiscountAmount: number;

  public readonly quantity: number;

  public readonly type: VoucherDiscountTypes;

  public readonly createdAt: Date;

  public readonly expiresAt: Date;

  public readonly active: boolean;

  public readonly usedAt: Date | null;

  constructor(params: VoucherParams) {
    super(params.id);
    this.code = params.code;
    this.percentageAmount = params.percentageAmount;
    this.rawDiscountAmount = params.rawDiscountAmount;
    this.quantity = params.quantity;
    this.type = params.type;
    this.createdAt = params.createdAt;
    this.usedAt = params.usedAt || null;
    this.expiresAt = params.expiresAt;
    this.active = params.active;

    this.validate();
  }

  public validate(): boolean | void {
    Validator.setData(this)
      .setRule('code', ['required', 'number', 'integer'])
      .setRule('percentageAmount', ['number'])
      .setRule('rawDiscountAmount', ['number'])
      .setRule('quantity', ['required', 'number', 'integer'])
      .setRule('active', ['boolean'])
      .validate();
  }
}
