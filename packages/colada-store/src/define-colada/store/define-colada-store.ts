/**
 * defineColadaStore – store definition and lifecycle for colada-store.
 * Skeleton: uses defineColadaStructure with StructureAccessorsConfig (id, deps, constants, state, getters, helpers, actions, hooks, constructor).
 * Singleton/global semantics are specific to this interface. See [define-colada-store.agents.md](./define-colada-store.agents.md).
 */

import type {
  CreateStructureResult,
  DefinitionShape,
} from '../structure/define-colada-structure';
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
  TDefinition extends DefinitionShape<StoreOrderedKeys, TDefinition> &
    Record<string, unknown>,
>(definitionFactory: () => TDefinition): CreateStructureResult<StoreOrderedKeys> {
  const create = defineColadaStructure(({ StructureAccessorTypes }) => [
    { id: StructureAccessorTypes.STRUCTURE_NAME },
    { deps: StructureAccessorTypes.OBJECT },
    { constants: StructureAccessorTypes.OBJECT_READONLY },
    { state: StructureAccessorTypes.OBJECT_REACTIVE_READONLY },
    { getters: StructureAccessorTypes.OBJECT_COMPUTED },
    { helpers: StructureAccessorTypes.METHODS_INTERNAL },
    { actions: StructureAccessorTypes.METHODS },
    { hooks: StructureAccessorTypes.HOOKS },
    { constructor: StructureAccessorTypes.CONSTRUCTOR },
  ]);
  return create(definitionFactory);
}
