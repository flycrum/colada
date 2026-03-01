# Prefer `const` type parameters for narrowing

## Purpose

When the API needs to infer narrow literal types from the consumer's argument, use `const` on the generic type parameter so the library infers the narrowest type and downstream types stay precise.

## Requirements

- Use **`const` on generic type parameters** (e.g. `const TEntries extends readonly StructureAccessorConfigEntry[]`) when inferring from the consumer's argument (e.g. tuple of accessor entries)
- Prefer this over requiring the consumer to add runtime `as const`; the `const` modifier on the generic is the right place to enforce narrowing so consumers can write normal literals without extra assertions

## Relation

- [typings-principles.md](./typings-principles.md) – overall typings guidance
