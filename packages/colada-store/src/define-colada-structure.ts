/**
 * defineColadaStructure – core abstraction layer for colada interfaces.
 * Consumes StructureAccessorsConfig; injects prior accessors into each factory context; exposes dynamic internals and _structureAccessorsConfig.
 * See [define-colada-structure.reqs.md](./define-colada-structure.reqs.md).
 */

import type { StructureAccessorsConfigShape } from './define-colada-structure-accessors-config-map';

/** Instance shape: public accessors + dynamic internals (_accessorName, _structureAccessorsConfig). */
export type StructureInstance = Record<string, unknown>;

/**
 * Creates the structure layer. Config defines accessors in order; each accessor's factory receives context of all prior accessors.
 * Returns a function that accepts the definition factory and returns the composable. Skeleton: no reactivity/getters/actions logic.
 */
export function defineColadaStructure<
  TOrderedKeys extends readonly string[],
  TConfig extends StructureAccessorsConfigShape<TOrderedKeys>,
>(
  structureAccessorsConfig: TConfig
): <TDefinition extends Record<string, unknown>>(
  definitionFactory: () => TDefinition
) => { useComposable: (initProps?: unknown) => StructureInstance } {
  return function createStructure<TDefinition extends Record<string, unknown>>(
    definitionFactory: () => TDefinition
  ) {
    const definition = definitionFactory();
    const keys = structureAccessorsConfig.orderedKeys as readonly string[];
    const resolved: Record<string, unknown> = {};

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]!;
      const context: Record<string, unknown> = {};
      for (let j = 0; j < i; j++) {
        const priorKey = keys[j]!;
        context[priorKey] = resolved[priorKey];
      }
      const value = (definition as Record<string, unknown>)[key];
      resolved[key] =
        typeof value === 'function' ? (value as (ctx: unknown) => unknown)(context) : value;
    }

    const internal = {
      ...resolved,
      _structureAccessorsConfig: structureAccessorsConfig,
    } as Record<string, unknown>;
    for (const key of keys) {
      (internal as Record<string, unknown>)[`_${key}`] = resolved[key];
    }

    const instance = new Proxy(internal as StructureInstance, {
      get(target, prop: string) {
        return (target as Record<string, unknown>)[prop];
      },
      set(target, prop: string, value: unknown) {
        (target as Record<string, unknown>)[prop] = value;
        return true;
      },
    });

    return {
      useComposable(initProps?: unknown) {
        if (initProps !== undefined) {
          // Reserved: constructor/init props applied here in full implementation.
        }
        return instance;
      },
    };
  };
}
