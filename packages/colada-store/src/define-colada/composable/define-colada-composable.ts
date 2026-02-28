/**
 * defineColadaComposable – composable interface with constructor/init-call props.
 * Skeleton: uses defineColadaStructure with StructureAccessorsConfig including constructor.
 * See [define-colada-composable.agents.md](./define-colada-composable.agents.md).
 */

import type { CreateStructureResult, DefinitionShape } from '../structure/define-colada-structure';
import { defineColadaStructure } from '../structure/define-colada-structure';

type ComposableOrderedKeys = readonly [
  'name',
  'state',
  'getters',
  'helpers',
  'actions',
  'hooks',
  'constructor',
];

/**
 * Defines a colada composable. Accepts a factory that may include constructor/init shape.
 * Returns an object with useComposable(initProps?). Skeleton only.
 */
export function defineColadaComposable<
  TDefinition extends DefinitionShape<ComposableOrderedKeys, TDefinition> & Record<string, unknown>,
>(definitionFactory: () => TDefinition): CreateStructureResult<ComposableOrderedKeys> {
  const create = defineColadaStructure(({ StructureAccessorPresets }) => [
    { name: StructureAccessorPresets.structureName },
    { state: StructureAccessorPresets.stateReactiveReadonly },
    { getters: StructureAccessorPresets.gettersComputed },
    { helpers: StructureAccessorPresets.methodsPrivate },
    { actions: StructureAccessorPresets.methodsPublic },
    { hooks: StructureAccessorPresets.hooks },
    { constructor: StructureAccessorPresets.constructor },
  ]);
  return create(definitionFactory);
}
