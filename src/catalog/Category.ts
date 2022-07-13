import uuid from 'uuid';
import Entity from '../shared/abstractions/Entity';

export default class Category extends Entity {
  constructor() {
    super(uuid.v4());
  }

  validate(): boolean {
    return !!this;
  }
}
