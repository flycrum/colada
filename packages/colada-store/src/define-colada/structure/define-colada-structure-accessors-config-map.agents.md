# define-colada-structure-accessors-config-map

Package overview: [colada.agents.md](./colada.agents.md).

## Purpose

Builds the ordered, typed Structure Accessors config consumed by [define-colada-structure](./define-colada-structure.agents.md). Accepts an ordered list of single-key entries (accessor name → StructureAccessorType) and returns a structure supporting lookup by key and by index. Order is preserved so that defineColadaStructure can inject prior accessors into each factory context.

## Requirements

- **Order:** Config entries are in definition order; iteration and index lookup follow that order.
- **Lookup:** Support lookup by accessor name (key) and by index (position). Return a typed structure (e.g. Map plus ordered keys, or wrapper with `get(key)` and `getByIndex(i)`).
- **Typings (primary):** Types must be accurate and as simple as possible for this dynamic, order-dependent config. No ad-hoc assertions or unsafe casts. Any change to this layer must consider typings first; document type decisions here or in-code. Infer tuple of accessor names from the ordered entries so downstream (defineColadaStructure) can type context per accessor.

## Relation

Consumed by defineColadaStructure. Concrete StructureAccessorType behaviors and custom accessor types are a follow-up; this effort establishes config shape and order semantics only.
