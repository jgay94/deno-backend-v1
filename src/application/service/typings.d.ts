import { Identifiable } from "@infra/storage/mod.ts";
import { IRepository } from "@infra/repository/mod.ts";

export interface IService<T extends Identifiable> extends IRepository<T> {}
