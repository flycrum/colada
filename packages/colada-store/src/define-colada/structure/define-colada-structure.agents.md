# define-colada-structure

Package overview: [colada.agents.md](./colada.agents.md).

## Purpose

Core abstraction layer for colada interfaces. Consumes a [StructureAccessorsConfig](./define-colada-structure-accessors-config-map.agents.md) (ordered map of accessor name to StructureAccessorType). Implementations: [define-colada-store.ts](./define-colada-store.ts), [define-colada-state.ts](./define-colada-state.ts), [define-colada-composable.ts](./define-colada-composable.ts) build on this. Singleton/global behavior belongs to defineColadaStore, not this layer.

## Structure Accessors

Accessors are defined by the config: each entry is a name and a StructureAccessorType. No fixed base-props list; the config drives which accessors exist and in what order.

## Order and context

Accessors are ordered. **Any accessor's factory receives a context object containing all prior accessors (by name).** defineColadaStructure must type and implement this: for the accessor at position N, context = { accessorName: resolvedValue for each accessor at indices 0..N-1 }. Example: getters is after state, so getters receives `{ state }` (and any earlier accessors); actions receives all prior (e.g. `{ id, deps, constants, state, getters, helpers }`).

## Internals

Instance internals are **derived from the config**: one internal `_accessorName` per accessor in the config. **`_structureAccessorsConfig`** is always present so extensions (e.g. defineColadaStatePlus) can read or override the config.

## Typings (primary requirement)

Types must be **accurate and as simple as possible**. Design for dynamic, order-dependent config and context from the ground up. No ad-hoc assertions or unsafe casts. Any change to this layer must consider typings first; document type decisions here or in-code.
