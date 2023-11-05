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
  percentage_amount: number;
  raw_discount_amount: number;
  quantity: number;
  type: VoucherDiscountTypes;
  created_at: Date;
  expires_at: Date;
  active: boolean;
  usedAt: Date | null;
}

export default class Voucher extends Entity<VoucherProps> {
  public readonly code: number;

  public readonly percentage_amount: number;

  public readonly raw_discount_amount: number;

  public readonly quantity: number;

  public readonly type: VoucherDiscountTypes;

  public readonly created_at: Date;

  public readonly expires_at: Date;

  public readonly active: boolean;

  public readonly usedAt: Date | null;

  constructor(props: VoucherProps) {
    super(props.id);
    this.code = props.code;
    this.percentage_amount = props.percentage_amount;
    this.raw_discount_amount = props.raw_discount_amount;
    this.quantity = props.quantity;
    this.type = props.type;
    this.created_at = props.created_at;
    this.usedAt = props.usedAt || null;
    this.expires_at = props.expires_at;
    this.active = props.active;

    this.validate();
  }

  public validate(): boolean | void {
    Validator.setData(this)
      .setRule('code', ['required', 'number', 'integer'])
      .setRule('percentage_amount', ['number'])
      .setRule('raw_discount_amount', ['number'])
      .setRule('quantity', ['required', 'number', 'integer'])
      .setRule('active', ['boolean'])
      .validate();
  }
}
