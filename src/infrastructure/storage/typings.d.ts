/**
 * A type alias for a string that represents a unique identifier.
 */
export type Id = string;

/**
 * An interface for objects that have a unique identifier.
 */
export interface Identifiable {
  /**
   * The unique identifier of the object.
   */
  readonly id: Id;
}

/**
 * A generic storage interface for managing identifiable items.
 *
 * @template T - The type of items to be stored, which should extend the Identifiable interface.
 */
export interface IStorage<T extends Identifiable> {
  /**
   * Retrieves all items from the storage.
   *
   * @returns A promise that resolves to an array of all items.
   */
  getAll(): Promise<T[]>;

  /**
   * Retrieves an item from the storage by its ID.
   *
   * @param id - The ID of the item to retrieve.
   * @returns A promise that resolves to the item if found, or null if not found.
   */
  getById(id: Id): Promise<T | null>;

  /**
   * Creates a new item in the storage.
   *
   * @param item - The item to create.
   * @returns A promise that resolves to the created item.
   */
  create(item: T): Promise<T>;

  /**
   * Updates an existing item in the storage.
   *
   * @param id - The ID of the item to update.
   * @param item - The updated item.
   * @returns A promise that resolves to the updated item if found, or null if not found.
   */
  update(id: Id, item: Partial<T>): Promise<T | null>;

  /**
   * Creates a new item in the storage or updates an existing item if it already exists.
   *
   * @param item - The item to create or update.
   * @returns A promise that resolves to the created or updated item.
   */
  upsert(item: T): Promise<T>;

  /**
   * Deletes an item from the storage by its ID.
   *
   * @param id - The ID of the item to delete.
   * @returns A promise that resolves to a boolean indicating whether the item was deleted.
   */
  delete(id: Id): Promise<boolean>;

  /**
   * Removes all items from the storage.
   *
   * @returns A promise that resolves to void.
   */
  clear(): Promise<void>;

  /**
   * Checks if an item with the specified ID exists in the storage.
   *
   * @param id - The ID of the item to check.
   * @returns A promise that resolves to a boolean indicating whether the item exists.
   */
  exists(id: Id): Promise<boolean>;

  /**
   * Returns the total number of items stored.
   *
   * @returns A promise that resolves to the total number of items stored.
   */
  count(): Promise<number>;
}
