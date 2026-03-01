# Typings principles

## Purpose

How to write good TypeScript typings in this repo. Apply when authoring or refactoring types, lib APIs, composables, helpers.

## Requirements

- Keep typings **minimal and compact**
- Keep types **DRY**; avoid duplicating type logic
- Prefer **narrowed types** for returned values; widened types are mostly unacceptable
- Use **mapped types** so "go to definition" in the IDE works correctly (e.g. property on returned object resolves to its definition)
- **Never require consumers to statically cast** their accessors or callback params; inference must flow from libraries, utils, helpers, composables, etc
- **Avoid `any`** unless necessary; when you need a generic "any function" or "any async function" shape, use [FunctionAny](../../../packages/core-ts/src/types/function-any.ts) / [FunctionAnyPromise](../../../packages/core-ts/src/types/function-any-promise.ts) from core-ts instead of spelling `(...args: any[]) => any` or similar

## Relation

- [const-type-parameters.md](./const-type-parameters.md) – use `const` on generic type params for narrowing
- [core-ts-shared-types.md](./core-ts-shared-types.md) – reuse core-ts before duplicating
- [typescript-libraries.md](./typescript-libraries.md) – lodash-es, type-fest, etc
