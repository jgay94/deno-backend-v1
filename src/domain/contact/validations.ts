import { z } from "@zod/mod.ts";

export const CreateContactSchema = z.object({
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string(),
});

export type CreateContactInput = z.TypeOf<typeof CreateContactSchema>;

export const UpdateContactSchema = CreateContactSchema.extend({
  id: z.string(),
  accountId: z.string().optional(),
});

export type UpdateContactInput = z.TypeOf<typeof UpdateContactSchema>;

export const UpsertContactSchema = CreateContactSchema.extend({
  id: z.string().optional(),
  accountId: z.string().optional(),
});

export type UpsertContactInput = z.TypeOf<typeof UpsertContactSchema>;