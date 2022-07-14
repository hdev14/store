export default abstract class Entity {
  public id: string;

  protected constructor(id: string) {
    this.id = id;
  }

  abstract validate(): boolean | void

  public isEqual(obj: object) {
    return (JSON.stringify(this) === JSON.stringify(obj))
      || (this.id === (obj as Entity).id);
  }

  public toString() {
    return JSON.stringify(this, null, 2);
  }

  toObject() {
    const self = this;
    const names = Object.getOwnPropertyNames(self);
    return names.reduce((acc, propertyName) => {
      const [, withoutUndescore] = propertyName.split('_');

      return {
        ...acc,
        // @ts-ignore
        [withoutUndescore]: self[propertyName],
      };
    }, {});
  }
}
