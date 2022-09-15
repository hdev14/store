import { EventData, IEventHandler } from '@shared/@types/events';
import { ApplyVoucherData } from './ApplyVoucherCommand';

// TODO: finish logic
export default class ApplyVoucherCommandHandler implements IEventHandler<boolean> {
  public async handle(data: EventData<ApplyVoucherData>): Promise<boolean> {
    console.info(data);
    return Promise.resolve(false);
  }
}
