import IValueObject from '@shared/abstractions/IValueObject';

export type DimensionsParams = {
  height: number;
  width: number;
  depth: number;
}

export default class Dimensions implements IValueObject {
  public readonly height: number;

  public readonly width: number;

  public readonly depth: number;

  constructor(params: DimensionsParams) {
    this.height = params.height;
    this.width = params.width;
    this.depth = params.depth;
  }

  public toString() {
    return `LxAxP: ${this.width} x ${this.height} x ${this.depth}`;
  }
}
