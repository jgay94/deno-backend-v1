import { Id, Identifiable, IStorage } from "@infra/storage/mod.ts";
import { IRepository } from "./typings.d.ts";

/**
 * BaseRepository is an abstract class that implements the IRepository interface.
 * It serves as a base class for repositories and provides CRUD operations for entities
 * that extend the Identifiable interface.
 *
 * @template T - The type of the items to be managed, which should extend the Identifiable interface.
 * @implements {IRepository<T>} - Implements the IRepository interface for the specific item type.
 */
export abstract class BaseRepository<T extends Identifiable> implements IRepository<T> {
  /**
   * Constructs a new instance of the BaseRepository class.
   * @param storage - The storage implementation to use for the CRUD operations.
   */
  constructor(private storage: IStorage<T>) {}

  public async getAll(): Promise<T[]> {
    return await this.storage.getAll();
  }

  public async getById(id: Id): Promise<T | null> {
    return await this.storage.getById(id);
  }

  public async create(item: T): Promise<T> {
    return await this.storage.create(item);
  }

  public async update(id: Id, item: Partial<T>): Promise<T | null> {
    return await this.storage.update(id, item);
  }

  public async upsert(item: T): Promise<T> {
    return await this.storage.upsert(item);
  }

  public async delete(id: Id): Promise<boolean> {
    return await this.storage.delete(id);
  }

  public async clear(): Promise<void> {
    await this.storage.clear();
  }

  public async exists(id: Id): Promise<boolean> {
    return await this.storage.exists(id);
  }

  public async count(): Promise<number> {
    return await this.storage.count();
  }
}
