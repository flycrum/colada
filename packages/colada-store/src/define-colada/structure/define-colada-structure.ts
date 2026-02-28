/**
 * defineColadaStructure – core abstraction layer for colada interfaces.
 * Consumes StructureAccessorsConfig; injects prior accessors into each factory context; exposes dynamic internals and _structureAccessorsConfig.
 * See [define-colada-structure.agents.md](./define-colada-structure.agents.md).
 */

import type {
  OrderedKeysFromEntries,
  StructureAccessorConfigEntry,
  StructureAccessorsConfigShape,
} from './define-colada-structure-accessors-config-map';
import { defineColadaStructureAccessorsConfigMap } from './define-colada-structure-accessors-config-map';
import { StructureAccessorPresets } from './define-colada-structure-accessor-presets';

/** Context passed to structureConfigFactoryFn; provides presets. Config map is applied internally. */
export type StructureConfigFactoryContext = {
  StructureAccessorPresets: typeof StructureAccessorPresets;
};

/** Extracts the ordered-keys tuple from a StructureAccessorsConfigShape. */
export type OrderedKeysFromConfig<T> =
  T extends StructureAccessorsConfigShape<infer K> ? K : readonly string[];

/** Resolved type of an accessor: return type if it's a function, else the value type. */
type Resolved<T> = T extends (...args: unknown[]) => infer R ? R : T;

/** Index decrement for tuple recursion; max 10 accessors. */
type Dec = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * Context type passed to the accessor at index I: prior keys with their resolved types.
 * PriorContext<['state','getters','methods'], TDef, 1> = { state: Resolved<TDef['state']> }
 */
type PriorContext<
  Keys extends readonly string[],
  TDef extends Record<string, unknown>,
  I extends number,
> = I extends 0
  ? Record<string, never>
  : Keys extends readonly [infer K extends string, ...infer Rest extends string[]]
    ? Rest extends readonly string[]
      ? Record<K, Resolved<TDef[K]>> & PriorContext<Rest, TDef, Dec[I] & number>
      : Record<string, never>
    : Record<string, never>;

/**
 * Definition shape: each key is either a value or (ctx: PriorContext) => value.
 * Constrains the definition factory return type so callback params infer from prior accessors.
 */
export type DefinitionShape<
  Keys extends readonly string[],
  TDefinition extends Record<string, unknown>,
> = {
  [I in keyof Keys as Keys[I] extends string ? Keys[I] : never]: Keys[I] extends string
    ? PriorContext<Keys, TDefinition, I & number> extends infer C
      ? C extends Record<string, never>
        ? unknown
        : (ctx: C) => unknown
      : never
    : never;
};

/** Instance shape: public accessors + dynamic internals (_accessorName, _structureAccessorsConfig). */
export type StructureInstance = Record<string, unknown>;

/** Instance with narrowed accessor keys and internals from config. */
export type StructureInstanceWithKeys<TOrderedKeys extends readonly string[]> = Record<
  string,
  unknown
> & { [K in TOrderedKeys[number]]: unknown } & { [K in `_${TOrderedKeys[number]}`]: unknown } & {
  _structureAccessorsConfig: StructureAccessorsConfigShape<TOrderedKeys>;
};

/** Return type of the create function; useComposable accepts optional initProps. */
export interface CreateStructureResult<TOrderedKeys extends readonly string[]> {
  useComposable: (initProps?: unknown) => StructureInstanceWithKeys<TOrderedKeys>;
}

/**
 * Creates the structure layer. structureConfigFactoryFn receives context with StructureAccessorPresets;
 * it returns a tuple of single-key entries (accessor name → preset or full descriptor).
 * Config defines accessors in order; each accessor's factory receives context of all prior accessors.
 * Returns a function that accepts the definition factory and returns the composable. Skeleton: no reactivity/getters/actions logic.
 *
 * @example
 * const defineSimpleStructure = defineColadaStructure(({ StructureAccessorPresets }) => [
 *   { state: { type: 'object', vue: 'reactive' } },
 *   { getters: { type: 'object', vue: 'computed' } },
 *   { methods: { type: 'function' } },
 * ]);
 * const instance = defineSimpleStructure(() => ({
 *   state: { count: 0 },
 *   getters: ({ state }) => ({ double: () => state.count * 2 }),
 *   methods: ({ state, getters }) => ({ increment: () => {} }),
 * })).useComposable();
 */
export function defineColadaStructure<
  const TEntries extends readonly StructureAccessorConfigEntry[],
>(
  structureConfigFactoryFn: (context: StructureConfigFactoryContext) => TEntries
): <
  TDefinition extends Record<OrderedKeysFromEntries<TEntries>[number], unknown> &
    Record<string, unknown>,
>(
  definitionFactory: () => DefinitionShape<OrderedKeysFromEntries<TEntries>, TDefinition>
) => CreateStructureResult<OrderedKeysFromEntries<TEntries>> {
  const entries = structureConfigFactoryFn({ StructureAccessorPresets });
  const structureAccessorsConfig = defineColadaStructureAccessorsConfigMap(...entries);
  type TOrderedKeys = OrderedKeysFromEntries<TEntries>;
  return function createStructure<
    TDefinition extends Record<TOrderedKeys[number], unknown> & Record<string, unknown>,
  >(definitionFactory: () => DefinitionShape<TOrderedKeys, TDefinition>) {
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
        return instance as StructureInstanceWithKeys<TOrderedKeys>;
      },
    };
  };
}
