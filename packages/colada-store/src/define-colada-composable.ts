/**
 * defineColadaComposable – composable interface with constructor/init-call props.
 * Skeleton: uses defineColadaStructure with constructor enabled for init props.
 * See [define-colada-composable.reqs.md](./define-colada-composable.reqs.md).
 */

import { defineColadaStructure } from './define-colada-structure';

const COMPOSABLE_INTERFACE_CONFIG = {
  key: 'name',
  deps: false,
  constants: false,
  state: 'state',
  getters: 'getters',
  helpers: 'helpers',
  actions: 'actions',
  hooks: 'hooks',
  constructor: 'constructor',
} as const;

/**
 * Defines a colada composable. Accepts a factory that may include constructor/init shape.
 * Returns an object with useComposable(initProps?). Skeleton only.
 */
export function defineColadaComposable<TDefinition extends Record<string, unknown>>(
  definitionFactory: () => TDefinition
) {
  const create = defineColadaStructure(COMPOSABLE_INTERFACE_CONFIG);
  return create(definitionFactory);
}
