import { Contact, IContactStorage, IContactRepository, ContactEntity } from "@domain/contact/mod.ts";

import { BaseRepository } from "./base.ts";

/**
 * ContactRepository class provides an implementation of the IContactRepository interface
 * for managing Contact objects. It extends the BaseRepository class and uses
 * the IContactStorage for storage operations.
 *
 * @extends {BaseRepository<Contact>} - Extends the BaseRepository with the Contact type.
 * @implements {IContactRepository} - Implements the IContactRepository interface.
 */
export class ContactRepository extends BaseRepository<ContactEntity> implements IContactRepository {
  /**
   * Constructs a new instance of the ContactRepository class.
   * @param storage - The IContactStorage implementation to use for the CRUD operations.
   */
  constructor(storage: IContactStorage) {
    super(storage);
  }
}
