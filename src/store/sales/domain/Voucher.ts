/* eslint-disable no-unused-vars */

import Entity from '@shared/abstractions/Entity';

/* eslint-disable no-shadow */
export enum VoucherDiscountTypes {
  PERCENTAGE,
  ABSOLUTE
}

export type VoucherParams = {
  id: string;
  code: string;
  percentageAmount: number;
  rawDiscountAmount: number;
  quantity: number;
  type: VoucherDiscountTypes;
  createdAt: Date;
  expiresAt: Date;
  active: boolean;
  usedAt?: Date;
}

export default class Voucher extends Entity {
  public code: string;

  public percentageAmount: number;

  public rawDiscountAmount: number;

  public quantity: number;

  public type: VoucherDiscountTypes;

  public createdAt: Date;

  public expiresAt: Date;

  public active: boolean;

  public usedAt?: Date;

  constructor(params: VoucherParams) {
    super(params.id);
    this.code = params.code;
    this.percentageAmount = params.percentageAmount;
    this.rawDiscountAmount = params.rawDiscountAmount;
    this.quantity = params.quantity;
    this.type = params.type;
    this.createdAt = params.createdAt;
    this.usedAt = params.usedAt;
    this.expiresAt = params.expiresAt;
    this.active = params.active;
  }

  protected validate(): boolean | void {
    throw new Error('Method not implemented.');
  }
}
