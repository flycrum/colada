/**
 * defineColadaStore – store definition and lifecycle for colada-store.
 * Skeleton: uses defineColadaStructure with StructureAccessorsConfig (id, deps, constants, state, getters, helpers, actions, hooks, constructor).
 * Singleton/global semantics are specific to this interface. See [define-colada-store.reqs.md](./define-colada-store.reqs.md).
 */

import { defineColadaStructure } from './define-colada-structure';
import {
  defineColadaStructureAccessorsConfigMap,
  StructureAccessorTypes,
} from './define-colada-structure-accessors-config-map';

const STORE_ACCESSORS_CONFIG = defineColadaStructureAccessorsConfigMap(
  { id: StructureAccessorTypes.STRUCTURE_NAME },
  { deps: StructureAccessorTypes.OBJECT },
  { constants: StructureAccessorTypes.OBJECT_READONLY },
  { state: StructureAccessorTypes.OBJECT_REACTIVE_READONLY },
  { getters: StructureAccessorTypes.OBJECT_COMPUTED },
  { helpers: StructureAccessorTypes.METHODS_INTERNAL },
  { actions: StructureAccessorTypes.METHODS },
  { hooks: StructureAccessorTypes.HOOKS },
  { constructor: StructureAccessorTypes.CONSTRUCTOR }
);

/**
 * Defines a colada store. Accepts a factory returning id, deps, constants, state, getters, helpers, actions, hooks.
 * Returns an object with useComposable. Skeleton only.
 */
export function defineColadaStore<TDefinition extends Record<string, unknown>>(
  definitionFactory: () => TDefinition
) {
  const create = defineColadaStructure(STORE_ACCESSORS_CONFIG);
  return create(definitionFactory);
}
