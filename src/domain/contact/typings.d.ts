import { Identifiable } from "@infra/storage/mod.ts";

export interface Contact extends Identifiable {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  accountId?: string;
}
