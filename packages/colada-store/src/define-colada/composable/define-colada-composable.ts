/**
 * defineColadaComposable – composable interface with constructor/init-call props.
 * Skeleton: uses defineColadaStructure with StructureAccessorsConfig including constructor.
 * See [define-colada-composable.agents.md](./define-colada-composable.agents.md).
 */

import { defineColadaStructure } from '../structure/define-colada-structure';

/**
 * Defines a colada composable. Accepts a factory that may include constructor/init shape.
 * Returns an object with useComposable(initProps?). Skeleton only.
 */
export function defineColadaComposable<TDefinition extends Record<string, unknown>>(
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
        { hooks: StructureAccessorTypes.HOOKS },
        { constructor: StructureAccessorTypes.CONSTRUCTOR }
      )
  );
  return create(definitionFactory);
}
