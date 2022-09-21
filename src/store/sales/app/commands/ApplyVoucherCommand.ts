import { EventData } from '@shared/@types/events';
import Command from '@shared/abstractions/Command';

// TODO: finish logic
export type ApplyVoucherData = {
  customerId: string;
  voucherCode: string;
}

export default class ApplyVoucher extends Command<boolean, ApplyVoucherData> {
  public send(data: EventData<ApplyVoucherData>): Promise<boolean | void> {
    console.info(data);
    return Promise.resolve();
  }

  public validate(data: EventData<ApplyVoucherData>): boolean | void {
    console.info(data);
  }
}
