import { Id, Identifiable } from "@infra/storage/mod.ts";
import { IRepository } from "@infra/repository/mod.ts";

import { IService } from "./typings.d.ts";

export abstract class BaseService<T extends Identifiable> implements IService<T> {
  constructor(protected repository: IRepository<T>) {}

  public async getAll(): Promise<T[]> {
    return await this.repository.getAll();
  }

  public async getById(id: Id): Promise<T | null> {
    return await this.repository.getById(id);
  }

  public async create(item: T): Promise<T> {
    return await this.repository.create(item);
  }

  public async update(id: Id, item: Partial<T>): Promise<T | null> {
    return await this.repository.update(id, item);
  }

  public async upsert(item: T): Promise<T> {
    return await this.repository.upsert(item);
  }

  public async delete(id: Id): Promise<boolean> {
    return await this.repository.delete(id);
  }

  public async clear(): Promise<void> {
    await this.repository.clear();
  }

  public async exists(id: Id): Promise<boolean> {
    return await this.repository.exists(id);
  }

  public async count(): Promise<number> {
    return await this.repository.count();
  }
}
