# define-colada-structure-accessor-types

Package overview: [colada.agents.md](../../colada.agents.md).

## Purpose

Defines the discriminated-union type system for structure accessors. No name-based string constants; accessor behavior and typings are expressed via interfaces and unions (StructureAccessorBase, object variants, string, constructor, function, hooks). Used by [define-colada-structure-accessor-presets](./define-colada-structure-accessor-presets.ts) and [define-colada-structure-accessors-config-map](./define-colada-structure-accessors-config-map.ts).

## Requirements

- **Discriminated union:** StructureAccessorAllUnion = object variants | string | constructor | function | hooks. Object variants discriminate on type, access, vue.
- **Object variants:** Readonly (access 'readonly', mutability 'immutable') vs writable; vue: false | 'reactive' | 'computed'. StructureAccessorObjectReadonlyVueReactive for state; StructureAccessorObjectReadonlyVueComputed for getters; StructureAccessorObjectWritable(VueReactive) for mutable objects.
- **No name-based types:** Do not add STRUCTURE_NAME, OBJECT, etc. Use the interface/union system only.
- **Typings:** All interfaces export for downstream inference; StructureAccessorObjects is the object-only union for narrowing.
