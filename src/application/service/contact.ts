import {
  Contact,
  ContactEntity,
  IContactRepository,
  IContactService,
} from "@domain/contact/mod.ts";
import {
  CreateContactInput,
  CreateContactSchema,
  UpdateContactInput,
  UpdateContactSchema,
  UpsertContactInput,
  UpsertContactSchema,
} from "@domain/contact/validations.ts";
import { BaseService } from "./base.ts";
import { Id } from "@infra/storage/mod.ts";

export class ContactService extends BaseService<ContactEntity> implements IContactService {
  constructor(contactRepository: IContactRepository) {
    super(contactRepository);
  }

  public async create(input: CreateContactInput): Promise<ContactEntity> {
    const validatedInput = CreateContactSchema.parse(input);
    const contact = new ContactEntity(
      validatedInput.firstName,
      validatedInput.lastName,
      validatedInput.email,
      validatedInput.phone,
    );
    return super.create(contact);
  }

  public async update(id: Id, input: UpdateContactInput): Promise<Contact | null> {
    const validatedInput = UpdateContactSchema.parse(input);
    return super.update(id, validatedInput);
  }

  public async upsert(input: UpsertContactInput): Promise<ContactEntity> {
    const validatedInput = UpsertContactSchema.parse(input);
    const contact = new ContactEntity(
      validatedInput.firstName,
      validatedInput.lastName,
      validatedInput.email,
      validatedInput.phone,
    );
    return super.upsert(contact);
  }
}
