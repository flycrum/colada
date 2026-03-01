# define-colada-structure-accessor-presets

Package overview: [colada.agents.md](../../colada.agents.md).

## Purpose

Provides preset input types (StructureAccessorPresetInput) and runtime presets (StructureAccessorPresets) for common accessor combinations. normalizeStructureAccessor expands preset inputs or full descriptors to [StructureAccessorAllUnion](./define-colada-structure-accessor-types.ts). Used by [define-colada-structure-accessors-config-map](./define-colada-structure-accessors-config-map.ts) when building config.

## Requirements

- **Preset inputs:** Partial shapes (e.g. `{ type: 'object', vue: 'reactive' }`) that normalize to full descriptors with defaults. StructureAccessorInput = StructureAccessorPresetInput | StructureAccessorAllUnion.
- **Defaults:** visibility 'public', access 'readonly' → mutability 'immutable'; object reactive/computed/readonly/writable presets expand with correct constraints per [define-colada-structure-accessor-types](./define-colada-structure-accessor-types.agents.md).
- **Runtime presets:** StructureAccessorPresets.stateReactiveReadonly, gettersComputed, methodsPublic, methodsPrivate, structureName, constructor, hooks, objectReadonly, objectWritable, objectWritableReactive. Each satisfies the corresponding union member.
- **normalizeStructureAccessor:** Accepts StructureAccessorInput; returns StructureAccessorAllUnion. Throws for non-object input.
- **Typings:** Preset input types must be narrow so config entries are typed to presets or full descriptors; no loose any.
- **Tests:** spec and spec-d for presets and normalize; assert preset shapes and that normalize returns full descriptor.
