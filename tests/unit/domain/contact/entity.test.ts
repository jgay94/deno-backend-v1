import { beforeEach, describe, it } from "@std/testing/bdd.ts";
import { assertEquals } from "@std/testing/asserts.ts";

import { ContactEntity } from "@domain/contact/entity.ts";
import { Contact } from "@domain/contact/typings.d.ts";

describe("ContactEntity", () => {
  let contact: Contact;
  let contactEntity: ContactEntity;

  beforeEach(() => {
    contact = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "555-555-5555",
    };

    contactEntity = new ContactEntity(contact);
  });

  it("constructor should correctly initialize the ContactEntity properties", () => {
    assertEquals(contactEntity.id, contact.id);
    assertEquals(contactEntity.firstName, contact.firstName);
    assertEquals(contactEntity.lastName, contact.lastName);
    assertEquals(contactEntity.email, contact.email);
    assertEquals(contactEntity.phone, contact.phone);
    assertEquals(contactEntity.accountId, contact.accountId);
  });

  it("fullName getter should return the correct full name", () => {
    const expectedFullName = `${contact.firstName} ${contact.lastName}`;
    assertEquals(contactEntity.fullName, expectedFullName);
  });
});
