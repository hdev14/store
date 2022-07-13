export default abstract class Entity {
  public id: string;

  protected constructor(id: string) {
    this.id = id;
  }

  public isEqual(obj: object) {
    return (JSON.stringify(this) === JSON.stringify(obj))
      || (this.id === (obj as Entity).id);
  }

  public toString() {
    return JSON.stringify(this, null, 2);
  }

  abstract validate(): boolean
}
