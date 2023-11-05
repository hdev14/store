import Command from '@shared/abstractions/Command';
import Validator from '@shared/utils/Validator';

export default class ApplyVoucherCommand extends Command {
  constructor(
    readonly customer_id: string,
    readonly voucher_code: number,
  ) {
    super();
    this.validate();
  }

  protected validate(): void {
    Validator.setData(this)
      .setRule('customer_id', ['required', 'string', 'uuid'])
      .setRule('voucher_code', ['required', 'number', 'integer'])
      .validate();
  }
}
