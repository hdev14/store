export default class RepositoryError extends Error {
  constructor(repository: string, message: string) {
    super(`${repository} - ${message}`);
  }
}
