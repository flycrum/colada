# colada-store

Vue 3 store library supporting **global**, **local**, and **transient** stores—unlike Pinia, which is global-only. Use the same store pattern across your app whether you need app-wide state, component-scoped state, or short-lived instances.

## Goal

- **Global stores**: Shared across the app (similar to Pinia’s default).
- **Local stores**: Scoped to a component (or a subtree), so multiple instances can coexist.
- **Transient stores**: Created and destroyed on demand (e.g. per route or modal), with no global registry.

## API shape (planned)

Stores follow a **Pinia-style options API** (state, getters, actions), with these differences and extensions:

- **Factory / creator function**: Options are produced by a **function** (not a plain object), so each store instance can be created with different initial context or dependencies.
- **Deps (dependency injection)**: Declare dependencies (e.g. API client, router) that are injected when the store is created, for testability and flexibility.
- **Private actions**: Actions that are not exposed on the store instance, only used internally.
- **Lifecycle**: **onMounted** and **onUnmounted** hooks for setup/teardown when the store is mounted or disposed (especially for local/transient stores).

## Usage (planned)

Consumed via a composable from **useColadaStore** that returns a **named store instance**. You destructure from that instance directly; there is no `storeToRefs`-style helper—reactivity is preserved by design so destructuring from the store instance is safe.

## Inspiration

- **[Pinia](https://github.com/vuejs/pinia/tree/v3/packages/pinia/src)** – Options API shape (state, getters, actions) and overall source structure.
- **[Jotai](https://github.com/pmndrs/jotai)** – Composable patterns, treating definitions as “config” until initialized, minimal primitives, and composition. No atom-based API here, but the same philosophy. Jotai’s use of a WeakMap from config → `{ value, listeners, dependents }` is a useful reference for future implementation.

## Tech

- **ESM only** – No CommonJS build.
- **Built and distributed with Vite** – Library mode, ESM output, type declarations.

## Status

Skeleton only: this package currently exports a placeholder. Full implementation of `defineColadaStore`, global/local/transient semantics, deps, lifecycle, and getters/actions is not yet implemented.
