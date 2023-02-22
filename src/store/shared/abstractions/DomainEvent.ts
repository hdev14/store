import Event from './Event';

export default abstract class DomainEvent extends Event {
  constructor(readonly principalId: string) {
    super();
  }
}
