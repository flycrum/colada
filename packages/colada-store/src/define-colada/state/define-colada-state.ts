/**
 * defineColadaState – state interface (name, state, getters, helpers, actions, hooks).
 * Skeleton: uses defineColadaStructure with StructureAccessorsConfig; no deps/constants/constructor.
 * See [define-colada-state.agents.md](./define-colada-state.agents.md).
 */

import { defineColadaStructure } from '../structure/define-colada-structure';

/**
 * Defines a colada state. Accepts a factory returning name, state, getters, helpers, actions, hooks.
 * Returns an object with useComposable. Skeleton only.
 */
export function defineColadaState<TDefinition extends Record<string, unknown>>(
  definitionFactory: () => TDefinition
) {
  const create = defineColadaStructure(
    ({ defineColadaStructureAccessorsConfigMap, StructureAccessorTypes }) =>
      defineColadaStructureAccessorsConfigMap(
        { name: StructureAccessorTypes.STRUCTURE_NAME },
        { state: StructureAccessorTypes.OBJECT_REACTIVE_READONLY },
        { getters: StructureAccessorTypes.OBJECT_COMPUTED },
        { helpers: StructureAccessorTypes.METHODS_INTERNAL },
        { actions: StructureAccessorTypes.METHODS },
        { hooks: StructureAccessorTypes.HOOKS }
      )
  );
  return create(definitionFactory);
}
