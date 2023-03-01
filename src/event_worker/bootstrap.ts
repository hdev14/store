import BullmqEventWorker from '@shared/BullmqEventWorker';
import EventMediator from '@shared/EventMediator';

const eventMediator = new EventMediator();
// TODO: add handlers
const eventWorker = new BullmqEventWorker(eventMediator);

export default {
  eventWorker,
};
