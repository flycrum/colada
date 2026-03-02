/**
 * defineColadaStore – store definition and lifecycle for colada-store.
 * Skeleton: uses defineColadaStructure with StructureAccessorsConfig (id, deps, constants, state, getters, helpers, actions, hooks, constructor).
 * Singleton/global semantics are specific to this interface. See [define-colada-store.agents.md](./define-colada-store.agents.md).
 */

import type { CreateStructureResult, DefinitionShape } from '../structure/define-colada-structure';
import { defineColadaStructure } from '../structure/define-colada-structure';

type StoreOrderedKeys = readonly [
  'id',
  'deps',
  'constants',
  'state',
  'getters',
  'helpers',
  'actions',
  'hooks',
  'constructor',
];

/**
 * Defines a colada store. Accepts a factory returning id, deps, constants, state, getters, helpers, actions, hooks.
 * Returns an object with useComposable. Skeleton only.
 */
export function defineColadaStore<
  TDefinition extends DefinitionShape<StoreOrderedKeys, TDefinition> & Record<string, unknown>,
>(definitionFactory: () => TDefinition): CreateStructureResult<StoreOrderedKeys> {
  const create = defineColadaStructure(({ StructureAccessorPresets }) => [
    { id: StructureAccessorPresets.structureName },
    { deps: StructureAccessorPresets.objectWritable },
    { constants: StructureAccessorPresets.objectReadonly },
    { state: StructureAccessorPresets.stateReactiveReadonly },
    { getters: StructureAccessorPresets.gettersComputed },
    { helpers: StructureAccessorPresets.methodsPrivate },
    { actions: StructureAccessorPresets.methodsPublic },
    { hooks: StructureAccessorPresets.hooks },
    { constructor: StructureAccessorPresets.constructor },
  ]);
  return create(definitionFactory);
}
