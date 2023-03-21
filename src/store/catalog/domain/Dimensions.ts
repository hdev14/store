import IValueObject from '@shared/abstractions/IValueObject';

export type DimensionsProps = {
  height: number;
  width: number;
  depth: number;
}

export default class Dimensions implements IValueObject {
  public readonly height: number;

  public readonly width: number;

  public readonly depth: number;

  constructor(props: DimensionsProps) {
    this.height = props.height;
    this.width = props.width;
    this.depth = props.depth;
  }

  public toString() {
    return `LxAxP: ${this.width} x ${this.height} x ${this.depth}`;
  }
}
