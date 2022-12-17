interface IUnitOfWork {
  commit(): Promise<boolean>;
}

export default IUnitOfWork;
