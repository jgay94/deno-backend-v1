import { afterEach, beforeEach, describe, it } from "@std/testing/bdd.ts";
import { assertEquals } from "@std/testing/asserts.ts";

import { BaseRepository } from "@infra/repository/mod.ts";
import { Id, Identifiable, MemoryStorage } from "@infra/storage/mod.ts";

class TestEntity implements Identifiable {
  public id: Id;

  constructor(public name: string) {
    this.id = crypto.randomUUID();
  }
}

class TestRepository extends BaseRepository<TestEntity> {
  constructor() {
    super(new MemoryStorage<TestEntity>());
  }
}

describe("BaseRepository", () => {
  let repository: TestRepository;

  beforeEach(() => {
    repository = new TestRepository();
  });

  afterEach(async () => {
    await repository.clear();
  });

  it("should get all stored TestEntities", async () => {
    const testEntity1 = new TestEntity("testName1");
    const testEntity2 = new TestEntity("testName2");
    await repository.create(testEntity1);
    await repository.create(testEntity2);
    const allEntities = await repository.getAll();
    assertEquals(allEntities, [testEntity1, testEntity2]);
  });

  it("should get TestEntity by id", async () => {
    const testEntity = new TestEntity("testName");
    const createdEntity = await repository.create(testEntity);
    const retrievedEntity = await repository.getById(createdEntity.id);
    assertEquals(retrievedEntity, createdEntity);
  });

  it("should return null when getting non-existent TestEntity by id", async () => {
    const retrievedEntity = await repository.getById("non-existent-id");
    assertEquals(retrievedEntity, null);
  });

  it("should create and store a TestEntity", async () => {
    const testEntity = new TestEntity("testName");
    const createdEntity = await repository.create(testEntity);
    assertEquals(createdEntity, testEntity);
  });

  it("should update a TestEntity by id", async () => {
    const testEntity = new TestEntity("testName");
    const createdEntity = await repository.create(testEntity);
    const updatedEntity = await repository.update(createdEntity.id, { name: "updatedName" });
    assertEquals(updatedEntity?.name, "updatedName");
  });

  it("should upsert a TestEntity", async () => {
    const testEntity = new TestEntity("testName");
    const upsertedEntity = await repository.upsert(testEntity);
    assertEquals(upsertedEntity, testEntity);
    const existingEntity = await repository.getById(testEntity.id);
    assertEquals(existingEntity, testEntity);
  });

  it("should update an existing TestEntity using upsert", async () => {
    const testEntity = new TestEntity("testName");
    const createdEntity = await repository.create(testEntity);
    const updatedEntityData = { ...createdEntity, name: "updatedName" };
    const upsertedEntity = await repository.upsert(updatedEntityData);
    assertEquals(upsertedEntity, updatedEntityData);
    const existingEntity = await repository.getById(testEntity.id);
    assertEquals(existingEntity, updatedEntityData);
  });  

  it("should delete a TestEntity by id", async () => {
    const testEntity = new TestEntity("testName");
    const createdEntity = await repository.create(testEntity);
    const result = await repository.delete(createdEntity.id);
    assertEquals(result, true);
    const deletedEntity = await repository.getById(createdEntity.id);
    assertEquals(deletedEntity, null);
  });

  it("should clear all stored TestEntities", async () => {
    const testEntity1 = new TestEntity("testName1");
    const testEntity2 = new TestEntity("testName2");
    await repository.create(testEntity1);
    await repository.create(testEntity2);
    await repository.clear();
    const allEntities = await repository.getAll();
    assertEquals(allEntities, []);
  });

  it("should check if a TestEntity exists by id", async () => {
    const testEntity = new TestEntity("testName");
    const createdEntity = await repository.create(testEntity);
    const exists = await repository.exists(createdEntity.id);
    assertEquals(exists, true);
  });
  
  it("should return false when checking existence of non-existent TestEntity by id", async () => {
    const exists = await repository.exists("non-existent-id");
    assertEquals(exists, false);
  });

  it("should count the number of stored TestEntities", async () => {
    const testEntity1 = new TestEntity("testName1");
    const testEntity2 = new TestEntity("testName2");
    await repository.create(testEntity1);
    await repository.create(testEntity2);
    const count = await repository.count();
    assertEquals(count, 2);
  });
});
