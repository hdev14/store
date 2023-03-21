import crypto from 'crypto';

export default abstract class Entity<Props = Record<string, any>> {
  public readonly id: string;

  protected constructor(id?: string) {
    this.id = id || crypto.randomUUID();
  }

  public abstract validate(): boolean | void

  public isEqual(obj: object) {
    return (JSON.stringify(this) === JSON.stringify(obj))
      || (this.id === (obj as Entity).id);
  }

  public toObject(): Props {
    const object = JSON.parse(JSON.stringify(this));
    return object as Props;
  }

  public toString() {
    return JSON.stringify(this, null, 2);
  }
}
