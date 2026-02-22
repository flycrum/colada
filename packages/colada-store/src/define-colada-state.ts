/**
 * defineColadaState – state interface (name, state, getters, helpers, actions, hooks).
 * Skeleton: uses defineColadaStructure with StructureAccessorsConfig; no deps/constants/constructor.
 * See [define-colada-state.reqs.md](./define-colada-state.reqs.md).
 */

import { defineColadaStructure } from './define-colada-structure';
import {
  defineColadaStructureAccessorsConfigMap,
  StructureAccessorTypes,
} from './define-colada-structure-accessors-config-map';

const STATE_ACCESSORS_CONFIG = defineColadaStructureAccessorsConfigMap(
  { name: StructureAccessorTypes.STRUCTURE_NAME },
  { state: StructureAccessorTypes.OBJECT_REACTIVE_READONLY },
  { getters: StructureAccessorTypes.OBJECT_COMPUTED },
  { helpers: StructureAccessorTypes.METHODS_INTERNAL },
  { actions: StructureAccessorTypes.METHODS },
  { hooks: StructureAccessorTypes.HOOKS }
);

/**
 * Defines a colada state. Accepts a factory returning name, state, getters, helpers, actions, hooks.
 * Returns an object with useComposable. Skeleton only.
 */
export function defineColadaState<TDefinition extends Record<string, unknown>>(
  definitionFactory: () => TDefinition
) {
  const create = defineColadaStructure(STATE_ACCESSORS_CONFIG);
  return create(definitionFactory);
}
