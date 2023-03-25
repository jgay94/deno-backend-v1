import { describe, it } from "@std/testing/bdd.ts";
import { assertEquals } from "@std/testing/asserts.ts";

import { Identifiable, MemoryStorage } from "@infra/storage/mod.ts";

interface TestItem extends Identifiable {
  name: string;
}

describe("MemoryStorage", () => {
  describe("getAll", () => {
    it("should list all items", async () => {
      const storage = new MemoryStorage<TestItem>();
      const items: TestItem[] = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];

      await storage.create(items[0]);
      await storage.create(items[1]);
      const result = await storage.getAll();

      assertEquals(
        result,
        items,
        "The storage should list all stored items",
      );
    });
  });

  describe("getById", () => {
    it("should store and retrieve an item", async () => {
      const storage = new MemoryStorage<TestItem>();
      const item: TestItem = { id: "1", name: "Item 1" };

      await storage.create(item);
      const result = await storage.getById(item.id);

      assertEquals(
        result,
        item,
        "The stored item should match the retrieved item",
      );
    });

    it("should return null when retrieving a non-existent item", async () => {
      const storage = new MemoryStorage<TestItem>();
      const nonExistentId = "non-existent-id";

      const result = await storage.getById(nonExistentId);

      assertEquals(
        result,
        null,
        "The result should be null when retrieving a non-existent item",
      );
    });
  });

  describe("create", () => {
    it("should create and store an item", async () => {
      const storage = new MemoryStorage<TestItem>();
      const item: TestItem = { id: "1", name: "Item 1" };

      const createdItem = await storage.create(item);
      const storedItem = await storage.getById(item.id);

      assertEquals(
        createdItem,
        item,
        "The created item should match the input item",
      );
      assertEquals(
        storedItem,
        item,
        "The stored item should match the input item",
      );
    });
  });

  describe("update", () => {
    it("should update an item", async () => {
      const storage = new MemoryStorage<TestItem>();
      const item: TestItem = { id: "1", name: "Item 1" };
      const updatedItem: TestItem = { ...item, name: "Updated Item 1" };

      await storage.create(item);
      await storage.update(updatedItem.id, updatedItem);
      const result = await storage.getById(updatedItem.id);

      assertEquals(
        result,
        updatedItem,
        "The updated item should match the retrieved item",
      );
    });

    it("should return null when updating a non-existent item", async () => {
      const storage = new MemoryStorage<TestItem>();
      const nonExistentItem: TestItem = {
        id: "non-existent-id",
        name: "Non-existent Item",
      };

      const result = await storage.update(nonExistentItem.id, nonExistentItem);

      assertEquals(
        result,
        null,
        "The result should be null when updating a non-existent item",
      );
    });
  });

  describe("upsert", () => {
    it("should insert a new item with upsert", async () => {
      const storage = new MemoryStorage<TestItem>();
      const newItem: TestItem = { id: "3", name: "Item 3" };

      await storage.upsert(newItem);
      const result = await storage.getById(newItem.id);

      assertEquals(
        result,
        newItem,
        "The inserted item should match the retrieved item with upsert",
      );
    });

    it("should update an existing item with upsert", async () => {
      const storage = new MemoryStorage<TestItem>();
      const item: TestItem = { id: "1", name: "Item 1" };
      const updatedItem: TestItem = { ...item, name: "Updated Item 1" };

      await storage.create(item);
      await storage.upsert(updatedItem);
      const result = await storage.getById(updatedItem.id);

      assertEquals(
        result,
        updatedItem,
        "The updated item should match the retrieved item with upsert",
      );
    });
  });

  describe("delete", () => {
    it("should delete an item", async () => {
      const storage = new MemoryStorage<TestItem>();
      const item: TestItem = { id: "1", name: "Item 1" };

      await storage.create(item);
      await storage.delete(item.id);
      const result = await storage.getById(item.id);

      assertEquals(
        result,
        null,
        "The deleted item should not be retrievable",
      );
    });

    it("should return true when deleting an existing item", async () => {
      const storage = new MemoryStorage<TestItem>();
      const item: TestItem = { id: "1", name: "Item 1" };

      await storage.create(item);
      const result = await storage.delete(item.id);

      assertEquals(
        result,
        true,
        "The result should be true when deleting an existing item",
      );
    });

    it("should return false when deleting a non-existent item", async () => {
      const storage = new MemoryStorage<TestItem>();
      const nonExistentId = "non-existent-id";

      const result = await storage.delete(nonExistentId);

      assertEquals(
        result,
        false,
        "The result should be false when deleting a non-existent item",
      );
    });
  });

  describe("clear", () => {
    it("should clear all items", async () => {
      const storage = new MemoryStorage<TestItem>();
      const items: TestItem[] = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];

      await storage.create(items[0]);
      await storage.create(items[1]);
      await storage.clear();

      const count = await storage.count();
      assertEquals(count, 0, "The storage should be empty after clearing");
    });
  });

  describe("exists", () => {
    it("should check if an item exists", async () => {
      const storage = new MemoryStorage<TestItem>();
      const item: TestItem = { id: "1", name: "Item 1" };

      await storage.create(item);
      const result = await storage.exists(item.id);

      assertEquals(
        result,
        true,
        "The result should be true when checking for an existing item",
      );
    });

    it("should return false when checking for a non-existent item", async () => {
      const storage = new MemoryStorage<TestItem>();
      const nonExistentId = "non-existent-id";

      const result = await storage.exists(nonExistentId);

      assertEquals(
        result,
        false,
        "The result should be false when checking for a non-existent item",
      );
    });
  });

  describe("count", () => {
    it("should return the correct item count", async () => {
      const storage = new MemoryStorage<TestItem>();
      const items: TestItem[] = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];

      await storage.create(items[0]);
      await storage.create(items[1]);

      const count = await storage.count();
      assertEquals(
        count,
        items.length,
        "The storage count should match the number of items",
      );
    });
  });
});
