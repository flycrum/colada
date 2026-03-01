# TypeScript plugin rules

## Purpose

Context for writing and refactoring TypeScript typings. Use when touching types, lib APIs, composables, or type utilities.

## Rule files

- [typings-principles.md](./typings-principles.md) – Minimal/DRY/narrowed types; mapped types for IDE; no consumer casts
- [const-type-parameters.md](./const-type-parameters.md) – Use `const` on generic type params for narrowing
- [core-ts-shared-types.md](./core-ts-shared-types.md) – Check packages/core-ts/src/types first; use ExtractStrict, OmitStrict, FunctionAny, etc
- [typescript-libraries.md](./typescript-libraries.md) – lodash-es, luxon, type-fest, neverthrow
