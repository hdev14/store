export default class RepositoryError extends Error {
  public repository: string;

  constructor(repository: string, message: string) {
    super(message);
    this.repository = repository;
  }
}
