import Entity from '@shared/abstractions/Entity';
import Validator from '@shared/utils/Validator';

/* eslint-disable no-shadow */
export enum VoucherDiscountTypes {
  PERCENTAGE,
  ABSOLUTE
}

export type VoucherProps = {
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

export default class Voucher extends Entity<VoucherProps> {
  public readonly code: number;

  public readonly percentageAmount: number;

  public readonly rawDiscountAmount: number;

  public readonly quantity: number;

  public readonly type: VoucherDiscountTypes;

  public readonly createdAt: Date;

  public readonly expiresAt: Date;

  public readonly active: boolean;

  public readonly usedAt: Date | null;

  constructor(props: VoucherProps) {
    super(props.id);
    this.code = props.code;
    this.percentageAmount = props.percentageAmount;
    this.rawDiscountAmount = props.rawDiscountAmount;
    this.quantity = props.quantity;
    this.type = props.type;
    this.createdAt = props.createdAt;
    this.usedAt = props.usedAt || null;
    this.expiresAt = props.expiresAt;
    this.active = props.active;

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
