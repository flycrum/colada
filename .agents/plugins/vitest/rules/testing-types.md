# Testing types

- Assert only on types that flow from **calling** exported APIs (return types, composable result, instance keys). Do not assert on standalone fixture types unrelated to library return types
- **Files:** `*.spec-d.ts`. **Run:** `pnpm test` from root or package (typecheck included)
- **Libraries/utils/type utils:** Add a negative test suite (e.g. "negative cases: wrong type produces type error") with `@ts-expect-error` on invalid usage. Examples: [function-any-promise.spec-d.ts](../../../packages/core-ts/src/types/function-any-promise.spec-d.ts), [extract-strict.spec-d.ts](../../../packages/core-ts/src/types/extract-strict.spec-d.ts)
