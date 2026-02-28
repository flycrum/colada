/**
 * defineColadaState – state interface (name, state, getters, helpers, actions, hooks).
 * Skeleton: uses defineColadaStructure with StructureAccessorsConfig; no deps/constants/constructor.
 * See [define-colada-state.agents.md](./define-colada-state.agents.md).
 */

import type { CreateStructureResult, DefinitionShape } from '../structure/define-colada-structure';
import { defineColadaStructure } from '../structure/define-colada-structure';

type StateOrderedKeys = readonly ['name', 'state', 'getters', 'helpers', 'actions', 'hooks'];

/**
 * Defines a colada state. Accepts a factory returning name, state, getters, helpers, actions, hooks.
 * Returns an object with useComposable. Skeleton only.
 */
export function defineColadaState<
  TDefinition extends DefinitionShape<StateOrderedKeys, TDefinition> & Record<string, unknown>,
>(definitionFactory: () => TDefinition): CreateStructureResult<StateOrderedKeys> {
  const create = defineColadaStructure(({ StructureAccessorPresets }) => [
    { name: StructureAccessorPresets.structureName },
    { state: StructureAccessorPresets.stateReactiveReadonly },
    { getters: StructureAccessorPresets.gettersComputed },
    { helpers: StructureAccessorPresets.methodsPrivate },
    { actions: StructureAccessorPresets.methodsPublic },
    { hooks: StructureAccessorPresets.hooks },
  ]);
  return create(definitionFactory);
}
