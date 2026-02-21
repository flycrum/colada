/**
 * defineColadaStore – store definition and lifecycle for colada-store.
 * Skeleton: uses defineColadaStructure (key→id, all base props, constructor: false).
 * Singleton/global semantics are specific to this interface. See [define-colada-store.reqs.md](./define-colada-store.reqs.md).
 */

import { defineColadaStructure } from './define-colada-structure';

const STORE_INTERFACE_CONFIG = {
  key: 'id',
  deps: 'deps',
  constants: 'constants',
  state: 'state',
  getters: 'getters',
  helpers: 'helpers',
  actions: 'actions',
  hooks: 'hooks',
  constructor: false,
} as const;

/**
 * Defines a colada store. Accepts a factory returning id, deps, constants, state, getters, helpers, actions, hooks.
 * Returns an object with useComposable. Skeleton only.
 */
export function defineColadaStore<TDefinition extends Record<string, unknown>>(
  definitionFactory: () => TDefinition
) {
  const create = defineColadaStructure(STORE_INTERFACE_CONFIG);
  return create(definitionFactory);
}
