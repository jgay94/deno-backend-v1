import { Id, Identifiable, IStorage } from "@infra/storage/typings.d.ts";

/**
 * A filesystem implementation of the IStorage interface for managing identifiable items.
 * This class uses JSON files to store the items and provides methods to perform CRUD operations
 * and other storage-related tasks.
 *
 * @template T - The type of items to be stored, which should extend the Identifiable interface.
 */
export class FileStorage<T extends Identifiable> implements IStorage<T> {
  private filePath: string;

  public constructor(filePath: string) {
    this.filePath = filePath;
  }

  /**
   * Reads data from the JSON file and returns a Map with the stored data.
   * If the file is not found, an empty Map is returned.
   *
   * @returns A Promise that resolves to a Map with the stored data.
   * @throws {Deno.errors.NotFound} If the file is not found.
   * @throws {Error} If there's an error while reading or parsing the file.
   */
  private async readData(): Promise<Map<Id, T>> {
    try {
      const data = await Deno.readTextFile(this.filePath);
      const parsedData = JSON.parse(data);
      return new Map(Object.entries(parsedData));
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return new Map();
      }
      throw error;
    }
  }

  /**
   * Writes the provided data Map to the JSON file on the filesystem.
   *
   * @param data - The Map object containing the data to be written.
   * @returns A Promise that resolves when the data is written to the file.
   * @throws {Error} If there's an error while writing or serializing the data.
   */
  private async writeData(data: Map<Id, T>): Promise<void> {
    const serializedData = JSON.stringify(Object.fromEntries(data));
    await Deno.writeTextFile(this.filePath, serializedData);
  }

  public async getAll(): Promise<T[]> {
    const data = await this.readData();
    return Array.from(data.values());
  }

  public async getById(id: Id): Promise<T | null> {
    const data = await this.readData();
    return data.get(id) || null;
  }

  public async create(item: T): Promise<T> {
    const data = await this.readData();
    data.set(item.id, item);
    await this.writeData(data);
    return item;
  }

  public async update(id: Id, item: T): Promise<T | null> {
    const data = await this.readData();
    if (!data.has(id)) {
      return null;
    }
    data.set(id, item);
    await this.writeData(data);
    return item;
  }

  public async upsert(item: T): Promise<T> {
    const data = await this.readData();
    data.set(item.id, item);
    await this.writeData(data);
    return item;
  }

  public async delete(id: Id): Promise<boolean> {
    const data = await this.readData();
    const result = data.delete(id);
    await this.writeData(data);
    return result;
  }

  public async clear(): Promise<void> {
    await this.writeData(new Map());
  }

  public async exists(id: Id): Promise<boolean> {
    const data = await this.readData();
    return data.has(id);
  }

  public async count(): Promise<number> {
    const data = await this.readData();
    return data.size;
  }
}
