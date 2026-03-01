# Testing types

## Purpose

Type tests ensure the library's typings are correct at the call site. See repo root [AGENTS.md](../../../AGENTS.md) for repo rules and [Vitest testing types](https://vitest.dev/guide/testing-types) for the test API.

## Requirements

- Assert only on types that flow from **calling** the exported APIs: return types, `useComposable()` result, instance keys
- Do not assert on standalone fixture types (e.g. hand-written definition type) unrelated to the library's return types. Goal: verify library typings come through when implementing

## Where

- **Files:** Vitest type tests live in `*.spec-d.ts` (e.g. [packages/colada-store/src/define-colada/state/define-colada-state.spec-d.ts](../../../packages/colada-store/src/define-colada/state/define-colada-state.spec-d.ts))
- **Run:** `pnpm test` from root or from the package; typecheck included via `--typecheck`

## Negative cases in spec-d.ts (libraries, utils, type utils)

When writing type tests for **libraries, utils, helpers, or type utilities**, add a dedicated **negative** test suite so invalid usage produces type errors. Use a `describe` with a clear name (e.g. "negative cases: wrong resolved type produces type error", "negative cases: invalid Union produces type error", "negative cases: Keys not in ObjectType produce type error"). Add enough individual negative tests (with `@ts-expect-error` on the line that should error) to be confident the typings reject invalid usage—not every possible negative, but a representative set. Examples: [function-any-promise.spec-d.ts](../../../packages/core-ts/src/types/function-any-promise.spec-d.ts) (wrong resolved type), [extract-strict.spec-d.ts](../../../packages/core-ts/src/types/extract-strict.spec-d.ts) (invalid Union), [function-any.spec-d.ts](../../../packages/core-ts/src/types/function-any.spec-d.ts) (wrong return type), [omit-strict.spec-d.ts](../../../packages/core-ts/src/types/omit-strict.spec-d.ts) (Keys not in ObjectType).

## Relation

Backlink: [AGENTS.md](../../../AGENTS.md) (How to refactor code / Type tests)
