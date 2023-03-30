import crypto from 'crypto';

const DATE_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\w+/g;

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
    const object = this.transformToObject(this);

    return object as Props;
  }

  protected transformToObject(object: any) {
    return JSON.parse(JSON.stringify(object), (key, value) => {
      if (DATE_REGEX.test(value)) {
        console.info(key, value);
        return new Date(value);
      }

      return value;
    });
  }

  public toString() {
    return JSON.stringify(this, null, 2);
  }
}
