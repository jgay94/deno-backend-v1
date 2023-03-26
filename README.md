# deno-backend-v1
 A Deno backend featuring a domain model, storage, repositories, and services.

## Project Structure
```
src/
├── main.ts
├── domain/
│   └── contact/
│       ├── mod.ts
│       ├── entity.ts
│       └── typings.d.ts
├── infrastructure/
│   ├── repository/
│   │   ├── mod.ts
│   │   ├── base.ts
│   │   └── typings.d.ts
│   └── storage/
│       ├── mod.ts
│       ├── filesystem.ts
│       ├── memory.ts
│       └── typings.d.ts
```