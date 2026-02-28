# define-colada-structure-accessors-config-map

Package overview: [colada.agents.md](./colada.agents.md).

## Purpose

Builds the ordered, typed Structure Accessors config consumed by [define-colada-structure](./define-colada-structure.agents.md). Accepts an ordered list of single-key entries (accessor name → [StructureAccessorInput](./define-colada-structure-accessor-presets.ts): preset or full descriptor). Entry values are normalized via [normalizeStructureAccessor](./define-colada-structure-accessor-presets.ts); config stores [StructureAccessorAllUnion](./define-colada-structure-accessor-types.ts). Returns a structure supporting lookup by key and by index. Order is preserved so that defineColadaStructure can inject prior accessors into each factory context.

## Requirements

- **Order:** Config entries are in definition order; iteration and index lookup follow that order.
- **Lookup:** Support lookup by accessor name (key) and by index (position). get(key) returns StructureAccessorAllUnion | undefined; getByIndex(i) returns [key, StructureAccessorAllUnion] | undefined.
- **Typings (primary):** Types must be accurate and as simple as possible for this dynamic, order-dependent config. No ad-hoc assertions or unsafe casts. Infer tuple of accessor names (OrderedKeysFromEntries) from the ordered entries so downstream (defineColadaStructure) can type context per accessor.

## Relation

Consumed by defineColadaStructure. Accessor types from [define-colada-structure-accessor-types](./define-colada-structure-accessor-types.ts); presets and normalize from [define-colada-structure-accessor-presets](./define-colada-structure-accessor-presets.ts).
