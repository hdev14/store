export default abstract class Entity {
  protected constructor(private id: string) {}

  public isEqual(obj: object) {
    return (JSON.stringify(this) === JSON.stringify(obj)) 
      || (this.id === (obj as Entity).id)
  }
}