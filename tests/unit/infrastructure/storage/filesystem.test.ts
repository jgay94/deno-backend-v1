import { afterEach, describe, it } from "@std/testing/bdd.ts";
import { assertEquals } from "@std/testing/asserts.ts";

import { FileStorage, Identifiable } from "@infra/storage/mod.ts";

interface TestItem extends Identifiable {
  name: string;
}

const testFilePath = "./test-data.json";

/** Helper function to remove the test file after each test */
async function cleanup() {
  try {
    await Deno.remove(testFilePath);
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }
}

afterEach(cleanup);

describe("FileStorage", () => {
  describe("getAll", () => {
    it("should list all items from the JSON file", async () => {
      const items: TestItem[] = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];

      // Write test data to the JSON file
      await Deno.writeTextFile(testFilePath, JSON.stringify(items));

      const storage = new FileStorage<TestItem>(testFilePath);
      const result = await storage.getAll();

      assertEquals(
        result,
        items,
        "The storage should list all stored items from the JSON file",
      );
    });

    it("should return an empty array if the JSON file does not exist", async () => {
      const storage = new FileStorage<TestItem>(testFilePath);
      const result = await storage.getAll();

      assertEquals(
        result,
        [],
        "The storage should return an empty array if the JSON file does not exist",
      );
    });
  });

  describe("getById", () => {
    it("should return the item with the given ID", async () => {
      const items: TestItem[] = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];

      // Create a Map with the items
      const itemMap = new Map(items.map((item) => [item.id, item]));

      // Write test data to the JSON file
      await Deno.writeTextFile(
        testFilePath,
        JSON.stringify(Object.fromEntries(itemMap)),
      );

      const storage = new FileStorage<TestItem>(testFilePath);

      const result1 = await storage.getById("1");
      const result2 = await storage.getById("2");

      assertEquals(
        result1,
        items[0],
        "The storage should return the item with the given ID",
      );

      assertEquals(
        result2,
        items[1],
        "The storage should return the item with the given ID",
      );
    });

    it("should return null if the item with the given ID does not exist", async () => {
      const items: TestItem[] = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];

      // Write test data to the JSON file
      await Deno.writeTextFile(testFilePath, JSON.stringify(items));

      const storage = new FileStorage<TestItem>(testFilePath);

      const result = await storage.getById("3");

      assertEquals(
        result,
        null,
        "The storage should return null if the item with the given ID does not exist",
      );
    });

    it("should return null if the JSON file does not exist", async () => {
      const storage = new FileStorage<TestItem>(testFilePath);
      const result = await storage.getById("1");

      assertEquals(
        result,
        null,
        "The storage should return null if the JSON file does not exist",
      );
    });
  });

  describe("create", () => {
    it("should add a new item to the JSON file", async () => {
      const newItem: TestItem = { id: "3", name: "Item 3" };

      const storage = new FileStorage<TestItem>(testFilePath);
      await storage.create(newItem);

      const items = await storage.getAll();

      assertEquals(
        items.length,
        1,
        "The storage should add a new item to the JSON file",
      );

      assertEquals(
        items[0],
        newItem,
        "The storage should add the correct item to the JSON file",
      );
    });

    it("should create a new JSON file if it does not exist", async () => {
      const newItem: TestItem = { id: "1", name: "Item 1" };

      const storage = new FileStorage<TestItem>(testFilePath);
      await storage.create(newItem);

      const items = await storage.getAll();

      assertEquals(
        items.length,
        1,
        "The storage should create a new JSON file and add the item",
      );

      assertEquals(
        items[0],
        newItem,
        "The storage should add the correct item to the newly created JSON file",
      );
    });
  });

  describe("update", () => {
    it("should update an existing item in the JSON file", async () => {
      const items: TestItem[] = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];

      // Create a Map with the items
      const itemMap = new Map(items.map((item) => [item.id, item]));

      // Write test data to the JSON file
      await Deno.writeTextFile(
        testFilePath,
        JSON.stringify(Object.fromEntries(itemMap)),
      );

      const updatedItem: TestItem = { id: "1", name: "Updated Item 1" };

      const storage = new FileStorage<TestItem>(testFilePath);
      const result = await storage.update("1", updatedItem);

      assertEquals(
        result,
        updatedItem,
        "The storage should return the updated item after updating it in the JSON file",
      );

      const updatedItems = await storage.getAll();

      assertEquals(
        updatedItems.length,
        2,
        "The storage should maintain the same number of items",
      );

      assertEquals(
        updatedItems[0],
        updatedItem,
        "The storage should update the correct item in the JSON file",
      );
    });

    it("should return null if the item to be updated does not exist", async () => {
      const items: TestItem[] = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];

      // Write test data to the JSON file
      await Deno.writeTextFile(testFilePath, JSON.stringify(items));

      const nonExistentItem: TestItem = { id: "3", name: "Non-existent Item" };

      const storage = new FileStorage<TestItem>(testFilePath);

      const result = await storage.update("3", nonExistentItem);

      assertEquals(
        result,
        null,
        "The storage should return null if the item to be updated does not exist",
      );
    });

    it("should return null if the JSON file does not exist", async () => {
      const nonExistentItem: TestItem = { id: "1", name: "Non-existent Item" };

      const storage = new FileStorage<TestItem>(testFilePath);

      const result = await storage.update("1", nonExistentItem);

      assertEquals(
        result,
        null,
        "The storage should return null if the JSON file does not exist",
      );
    });
  });

  describe("upsert", () => {
    it("should insert a new item if it does not exist", async () => {
      const items: TestItem[] = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];

      // Write test data to the JSON file
      await Deno.writeTextFile(testFilePath, JSON.stringify(items));

      const newItem: TestItem = { id: "3", name: "Item 3" };

      const storage = new FileStorage<TestItem>(testFilePath);
      await storage.upsert(newItem);

      const updatedItems = await storage.getAll();

      assertEquals(
        updatedItems.length,
        3,
        "The storage should increase the item count after inserting a new item",
      );

      const insertedItem = updatedItems.find((item) => item.id === newItem.id);

      assertEquals(
        insertedItem,
        newItem,
        "The storage should insert the new item when it does not exist",
      );
    });

    it("should update an existing item if it exists", async () => {
      const items: TestItem[] = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];

      // Create a Map with the items
      const itemMap = new Map(items.map((item) => [item.id, item]));

      // Write test data to the JSON file
      await Deno.writeTextFile(
        testFilePath,
        JSON.stringify(Object.fromEntries(itemMap)),
      );

      const updatedItem: TestItem = { id: "1", name: "Updated Item 1" };

      const storage = new FileStorage<TestItem>(testFilePath);
      await storage.upsert(updatedItem);

      const updatedItems = await storage.getAll();

      assertEquals(
        updatedItems.length,
        2,
        "The storage should maintain the same item count after updating an existing item",
      );

      const updatedStoredItem = updatedItems.find((item) =>
        item.id === updatedItem.id
      );

      assertEquals(
        updatedStoredItem,
        updatedItem,
        "The storage should update the existing item when it exists",
      );
    });

    it("should create a new JSON file and insert the item if the JSON file does not exist", async () => {
      const newItem: TestItem = { id: "1", name: "Item 1" };

      const storage = new FileStorage<TestItem>(testFilePath);
      await storage.upsert(newItem);

      const items = await storage.getAll();

      assertEquals(
        items.length,
        1,
        "The storage should create a new JSON file and add the item",
      );

      assertEquals(
        items[0],
        newItem,
        "The storage should add the correct item to the newly created JSON file",
      );
    });
  });

  describe("delete", () => {
    it("should delete an existing item from the JSON file", async () => {
      const items: TestItem[] = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];

      // Create a Map with the items
      const itemMap = new Map(items.map((item) => [item.id, item]));

      // Write test data to the JSON file
      await Deno.writeTextFile(
        testFilePath,
        JSON.stringify(Object.fromEntries(itemMap)),
      );

      const storage = new FileStorage<TestItem>(testFilePath);
      const wasDeleted = await storage.delete("1");

      assertEquals(
        wasDeleted,
        true,
        "The storage should return true if the item was deleted from the JSON file",
      );

      const updatedItems = await storage.getAll();

      assertEquals(
        updatedItems.length,
        1,
        "The storage should have one less item after deletion",
      );

      assertEquals(
        updatedItems[0],
        items[1],
        "The storage should remove the correct item from the JSON file",
      );
    });

    it("should return false if the item with the given ID does not exist", async () => {
      const items: TestItem[] = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];

      // Create a Map with the items
      const itemMap = new Map(items.map((item) => [item.id, item]));

      // Write test data to the JSON file
      await Deno.writeTextFile(
        testFilePath,
        JSON.stringify(Object.fromEntries(itemMap)),
      );

      const storage = new FileStorage<TestItem>(testFilePath);
      const wasDeleted = await storage.delete("3");

      assertEquals(
        wasDeleted,
        false,
        "The storage should return false if the item with the given ID does not exist",
      );

      const updatedItems = await storage.getAll();

      assertEquals(
        updatedItems.length,
        2,
        "The storage should maintain the same number of items",
      );
    });
  });

  describe("clear", () => {
    it("should remove all items from the JSON file", async () => {
      const items: TestItem[] = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];

      // Create a Map with the items
      const itemMap = new Map(items.map((item) => [item.id, item]));

      // Write test data to the JSON file
      await Deno.writeTextFile(
        testFilePath,
        JSON.stringify(Object.fromEntries(itemMap)),
      );

      const storage = new FileStorage<TestItem>(testFilePath);
      await storage.clear();

      const updatedItems = await storage.getAll();

      assertEquals(
        updatedItems.length,
        0,
        "The storage should have no items after clearing the JSON file",
      );
    });

    it("should do nothing if the JSON file does not exist", async () => {
      const storage = new FileStorage<TestItem>(testFilePath);
      await storage.clear();

      const updatedItems = await storage.getAll();

      assertEquals(
        updatedItems.length,
        0,
        "The storage should have no items if the JSON file does not exist",
      );
    });
  });

  describe("exists", () => {
    it("should return true if an item with the given ID exists in the JSON file", async () => {
      const items: TestItem[] = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];

      // Create a Map with the items
      const itemMap = new Map(items.map((item) => [item.id, item]));

      // Write test data to the JSON file
      await Deno.writeTextFile(
        testFilePath,
        JSON.stringify(Object.fromEntries(itemMap)),
      );

      const storage = new FileStorage<TestItem>(testFilePath);
      const exists1 = await storage.exists("1");
      const exists2 = await storage.exists("2");

      assertEquals(
        exists1,
        true,
        "The storage should return true if an item with the given ID exists in the JSON file",
      );

      assertEquals(
        exists2,
        true,
        "The storage should return true if an item with the given ID exists in the JSON file",
      );
    });

    it("should return false if an item with the given ID does not exist in the JSON file", async () => {
      const items: TestItem[] = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];

      // Write test data to the JSON file
      await Deno.writeTextFile(testFilePath, JSON.stringify(items));

      const storage = new FileStorage<TestItem>(testFilePath);
      const exists = await storage.exists("3");

      assertEquals(
        exists,
        false,
        "The storage should return false if an item with the given ID does not exist in the JSON file",
      );
    });

    it("should return false if the JSON file does not exist", async () => {
      const storage = new FileStorage<TestItem>(testFilePath);
      const exists = await storage.exists("1");

      assertEquals(
        exists,
        false,
        "The storage should return false if the JSON file does not exist",
      );
    });
  });

  describe("count", () => {
    it("should return the number of items in the JSON file", async () => {
      const items: TestItem[] = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];

      // Write test data to the JSON file
      await Deno.writeTextFile(testFilePath, JSON.stringify(items));

      const storage = new FileStorage<TestItem>(testFilePath);
      const itemCount = await storage.count();

      assertEquals(
        itemCount,
        items.length,
        "The storage should return the number of items in the JSON file",
      );
    });

    it("should return 0 if the JSON file does not exist", async () => {
      const storage = new FileStorage<TestItem>(testFilePath);
      const itemCount = await storage.count();

      assertEquals(
        itemCount,
        0,
        "The storage should return 0 if the JSON file does not exist",
      );
    });
  });
});
