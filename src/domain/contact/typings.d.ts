import { Identifiable, IStorage } from "@infra/storage/mod.ts";
import { IRepository } from "@infra/repository/mod.ts";

/**
 * Contact interface represents the structure of a contact object.
 * @extends {Identifiable} - Extends the Identifiable interface to include an id property.
 */
export interface Contact extends Identifiable {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  accountId?: string;
}

/**
 * IContactStorage interface represents a storage implementation specifically for Contact objects.
 * @extends {IStorage<Contact>} - Extends the IStorage interface with the Contact type.
 */
export interface IContactStorage extends IStorage<Contact> {}

/**
 * IContactRepository interface represents a repository implementation specifically for Contact objects.
 * @extends {IRepository<Contact>} - Extends the IRepository interface with the Contact type.
 */
export interface IContactRepository extends IRepository<Contact> {}
