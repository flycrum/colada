---
name: writing-type-tests
description: Write or update Vitest type tests (*.test-d.ts). Use when writing or updating type tests, or when asked to add type tests. Assert only on types from the API; use *.test-d.ts; run pnpm test.
---

# Writing type tests

## When to use

- Writing or updating `*.test-d.ts` files
- User asks to add type tests for library typings

## Instructions

1. Assert only on types that flow from **calling** the exported APIs (return types, useComposable() result, instance keys). Do not assert on standalone fixture types unrelated to library return types
2. Use file extension `*.test-d.ts`
3. Run `pnpm test` from root or package; typecheck is included via `--typecheck`
4. See [testing-types.md](../../rules/testing-types.md) and repo root [AGENTS.md](../../../AGENTS.md) (How to refactor code / Type tests)
