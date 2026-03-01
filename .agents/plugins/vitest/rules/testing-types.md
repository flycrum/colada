# Testing types

## Purpose

Type tests ensure the library's typings are correct at the call site. See repo root [AGENTS.md](../../../AGENTS.md) for repo rules and [Vitest testing types](https://vitest.dev/guide/testing-types) for the test API.

## Requirements

- Assert only on types that flow from **calling** the exported APIs: return types, `useComposable()` result, instance keys
- Do not assert on standalone fixture types (e.g. hand-written definition type) unrelated to the library's return types. Goal: verify library typings come through when implementing

## Where

- **Files:** Vitest type tests live in `*.spec-d.ts` (e.g. [packages/colada-store/src/define-colada/state/define-colada-state.spec-d.ts](../../../packages/colada-store/src/define-colada/state/define-colada-state.spec-d.ts))
- **Run:** `pnpm test` from root or from the package; typecheck included via `--typecheck`

## Relation

Backlink: [AGENTS.md](../../../AGENTS.md) (How to refactor code / Type tests)
