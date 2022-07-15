import IValueObject from '../shared/abstractions/IValueObject';

type DimensionsParams = {
  height: number;
  width: number;
  depth: number;
}

export default class Dimensions implements IValueObject {
  public height: number;

  public width: number;

  public depth: number;

  constructor(params: DimensionsParams) {
    this.height = params.height;
    this.width = params.width;
    this.depth = params.depth;
  }

  toString() {
    return `LxAxP: ${this.width} x ${this.height} x ${this.depth}`;
  }
}
