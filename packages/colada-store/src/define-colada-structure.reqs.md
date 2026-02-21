# define-colada-structure

Package overview: [colada.reqs.md](./colada.reqs.md).

## Purpose

Core abstraction layer for colada interfaces. Defines base properties and mapping rules (rename, disable, wrap). Implementations: [define-colada-store.ts](./define-colada-store.ts), [define-colada-state.ts](./define-colada-state.ts), [define-colada-composable.ts](./define-colada-composable.ts) build on this. Singleton/global behavior belongs to defineColadaStore, not this layer.

## Base properties

Each base property is required in the interface config (rename, disable, or wrap):

- **key** – identifier (store renames to `id`, state to `name`)
- **deps** – dependency injection
- **constants** – constant values
- **state** – reactive state
- **getters** – computed properties
- **helpers** – internal helpers
- **actions** – public actions
- **hooks** – lifecycle hooks
- **constructor** – init-call props for the composable: same rules; `false` => no init args; wrapper => typed init props

## Interface config

For every base prop an interface can: expose under a different name (rename), set to `false` (exclude), or wrap to extend/type (e.g. constructor args). See [define-colada-store.reqs.md](./define-colada-store.reqs.md), [define-colada-state.reqs.md](./define-colada-state.reqs.md), [define-colada-composable.reqs.md](./define-colada-composable.reqs.md) for how each interface configures this layer.
