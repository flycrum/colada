/**
 * defineColadaComposable – composable interface with constructor/init-call props.
 * Skeleton: uses defineColadaStructure with StructureAccessorsConfig including constructor.
 * See [define-colada-composable.reqs.md](./define-colada-composable.reqs.md).
 */

import { defineColadaStructure } from './define-colada-structure';
import {
  defineColadaStructureAccessorsConfigMap,
  StructureAccessorTypes,
} from './define-colada-structure-accessors-config-map';

const COMPOSABLE_ACCESSORS_CONFIG = defineColadaStructureAccessorsConfigMap(
  { name: StructureAccessorTypes.STRUCTURE_NAME },
  { state: StructureAccessorTypes.OBJECT_REACTIVE_READONLY },
  { getters: StructureAccessorTypes.OBJECT_COMPUTED },
  { helpers: StructureAccessorTypes.METHODS_INTERNAL },
  { actions: StructureAccessorTypes.METHODS },
  { hooks: StructureAccessorTypes.HOOKS },
  { constructor: StructureAccessorTypes.CONSTRUCTOR }
);

/**
 * Defines a colada composable. Accepts a factory that may include constructor/init shape.
 * Returns an object with useComposable(initProps?). Skeleton only.
 */
export function defineColadaComposable<TDefinition extends Record<string, unknown>>(
  definitionFactory: () => TDefinition
) {
  const create = defineColadaStructure(COMPOSABLE_ACCESSORS_CONFIG);
  return create(definitionFactory);
}
