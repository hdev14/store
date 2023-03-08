import IValueObject from '@shared/abstractions/IValueObject';

// TODO: add validation.
export default class Email implements IValueObject {
  constructor(readonly value: string) {}

  public isValid() {
    throw new Error('Not implemented yet');
  }
}
