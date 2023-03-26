import { Identifiable, IStorage } from "@infra/storage/mod.ts";

/**
 * IRepository interface defines a generic repository with CRUD operations for handling
 * entities that extend the Identifiable interface.
 *
 * @template T - The type of the items to be managed, which should extend the Identifiable interface.
 * @extends {IStorage<T>} - Extends the IStorage interface for the specific item type.
 */
export interface IRepository<T extends Identifiable> extends IStorage<T> {}
