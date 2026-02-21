/**
 * defineColadaState – state interface (name, state, getters, helpers, actions, hooks).
 * Skeleton: uses defineColadaStructure; no deps/constants; key renamed to name.
 * See [define-colada-state.reqs.md](./define-colada-state.reqs.md).
 */

import { defineColadaStructure } from './define-colada-structure';

const STATE_INTERFACE_CONFIG = {
  key: 'name',
  deps: false,
  constants: false,
  state: 'state',
  getters: 'getters',
  helpers: 'helpers',
  actions: 'actions',
  hooks: 'hooks',
  constructor: false,
} as const;

/**
 * Defines a colada state. Accepts a factory returning name, state, getters, helpers, actions, hooks.
 * Returns an object with useComposable. Skeleton only.
 */
export function defineColadaState<TDefinition extends Record<string, unknown>>(
  definitionFactory: () => TDefinition
) {
  const create = defineColadaStructure(STATE_INTERFACE_CONFIG);
  return create(definitionFactory);
}
