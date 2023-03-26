import { Id } from "@infra/storage/mod.ts";

import { Contact } from "./typings.d.ts";

export class ContactEntity implements Contact {
  public readonly id: Id;
  public firstName: string;
  public lastName: string;
  public email: string;
  public phone: string;
  public accountId?: string;

  constructor(contact: Contact) {
    this.id = contact.id;
    this.firstName = contact.firstName;
    this.lastName = contact.lastName;
    this.email = contact.email;
    this.phone = contact.phone;
    this.accountId = contact.accountId;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
