# TypeScript libraries

## Purpose

Prefer existing libraries for types and runtime helpers to simplify and reduce custom typings.

## Libraries

- **lodash-es** — Type/object helpers: e.g. `isObject`, `isFunction`, `isUndefined`, `cloneDeep`, `pick`/`omit`, `isEmpty`
- **luxon** — Date/time: e.g. `DateTime`, `Duration`, `Interval`, `Settings`
- **type-fest** — Type utilities: e.g. `ValueOf`, `ReadonlyDeep`, `ArrayValues` (alias `typefest`)
- **neverthrow** — Result types: e.g. `ok`, `err`, `okAsync`, `ResultAsync` (should be used instead of try/catch in most scenarios!)

## Relation

- [typings-principles.md](./typings-principles.md) – overall typings guidance
- [core-ts-shared-types.md](./core-ts-shared-types.md) – in-repo shared types (core-ts)
