export interface IRepository<TEntity, TIdentifier> {
  findById(identifier: TIdentifier): Promise<TEntity | null>;
  save(entity: TEntity): Promise<void>;
  deleteById(identifier: TIdentifier): Promise<void>;
}
