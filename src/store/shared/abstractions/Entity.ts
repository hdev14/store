import crypto from 'crypto';

export default abstract class Entity {
  public readonly id: string;

  protected constructor(id?: string) {
    this.id = id || crypto.randomUUID();
  }

  public abstract validate(): boolean | void

  public isEqual(obj: object) {
    return (JSON.stringify(this) === JSON.stringify(obj))
      || (this.id === (obj as Entity).id);
  }

  public toObject() {
    return Object.fromEntries(Object.entries(this)
      .filter(([, value]) => typeof value !== 'function'));
  }

  public toString() {
    return JSON.stringify(this, null, 2);
  }
}
