import { Id, Identifiable, IStorage } from "./typings.d.ts";

/**
 * An in-memory implementation of the IStorage interface for managing identifiable items.
 * This class uses a Map to store the items and provides methods to perform CRUD operations
 * and other storage-related tasks.
 *
 * @template T - The type of items to be stored, which should extend the Identifiable interface.
 */
export class MemoryStorage<T extends Identifiable> implements IStorage<T> {
  private storage: Map<Id, T>;

  constructor() {
    this.storage = new Map<Id, T>();
  }

  public getAll(): Promise<T[]> {
    return Promise.resolve(Array.from(this.storage.values()));
  }

  public getById(id: Id): Promise<T | null> {
    return Promise.resolve(this.storage.get(id) || null);
  }

  public create(item: T): Promise<T> {
    this.storage.set(item.id, item);
    return Promise.resolve(item);
  }

  public update(id: Id, item: Partial<T>): Promise<T | null> {
    const currentItem = this.storage.get(id);

    if (!currentItem) {
      return Promise.resolve(null);
    }

    const updatedItem = { ...currentItem, ...item } as T;
    this.storage.set(id, updatedItem);
    return Promise.resolve(updatedItem);
  }

  public upsert(item: T): Promise<T> {
    this.storage.set(item.id, item);
    return Promise.resolve(item);
  }

  public delete(id: Id): Promise<boolean> {
    return Promise.resolve(this.storage.delete(id));
  }

  public clear(): Promise<void> {
    this.storage.clear();
    return Promise.resolve();
  }

  public exists(id: Id): Promise<boolean> {
    return Promise.resolve(this.storage.has(id));
  }

  public count(): Promise<number> {
    return Promise.resolve(this.storage.size);
  }
}
