# Typings principles

- Minimal, compact, DRY. Prefer narrowed types for returns; widened mostly unacceptable
- Mapped types so IDE "go to definition" resolves correctly
- Never require consumers to statically cast; inference must flow from libs/utils/composables
- Avoid `any`; for generic function shapes use [FunctionAny](../../../packages/core-ts/src/types/function-any.ts) / [FunctionAnyPromise](../../../packages/core-ts/src/types/function-any-promise.ts) from core-ts
