import IValueObject from '../shared/abstractions/IValueObject';

export default class Dimensions implements IValueObject {
  private height: number;

  private width: number;

  private depth: number;

  constructor(height: number, width: number, depth: number) {
    this.height = height;
    this.width = width;
    this.depth = depth;
  }

  toString() {
    return `LxAxP: ${this.width} x ${this.height} x ${this.depth}`;
  }
}
