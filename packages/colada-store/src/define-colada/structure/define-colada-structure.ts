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
 * Context at index I built from tuple of resolved types (enables left-to-right inference).
 * PriorFromTuple<['state','getters','methods'], [TState, TGetters, TMethods], 1> = { state: TState }
 */
type PriorFromTuple<
  Keys extends readonly string[],
  TTuple extends readonly unknown[],
  I extends number,
> = I extends 0
  ? Record<string, never>
  : Keys extends readonly [infer K0 extends string, ...infer RestKeys extends string[]]
    ? TTuple extends readonly [infer V0, ...infer RestTuple extends readonly unknown[]]
      ? RestKeys extends readonly string[]
        ? { [P in K0]: V0 } & PriorFromTuple<RestKeys, RestTuple, Dec[I] & number>
        : Record<string, never>
      : Record<string, never>
    : Record<string, never>;

/** I-th element of tuple (0-based). */
type TupleAt<T extends readonly unknown[], I extends number> = I extends 0
  ? T extends readonly [infer H, ...unknown[]]
    ? H
    : never
  : T extends readonly [unknown, ...infer R extends readonly unknown[]]
    ? TupleAt<R, Dec[I] & number>
    : never;

/** Value type for definition key at index I. */
type DefinitionShapeFromTupleValue<
  Keys extends readonly string[],
  TTuple extends readonly unknown[],
  I extends number,
> = PriorFromTuple<Keys, TTuple, I> extends infer C
  ? C extends Record<string, never>
    ? TupleAt<TTuple, I>
    : (ctx: C) => TupleAt<TTuple, I>
  : never;

/** Build shape as intersection of single-key objects so each key gets correct type (no union). */
type DefinitionShapeFromTupleIntersection<
  Keys extends readonly string[],
  TTuple extends readonly unknown[],
> = Keys extends readonly [
  infer K0 extends string,
  infer K1 extends string,
  infer K2 extends string,
  ...infer Rest extends string[],
]
  ? { [P in K0]: DefinitionShapeFromTupleValue<Keys, TTuple, 0> } & {
      [P in K1]: DefinitionShapeFromTupleValue<Keys, TTuple, 1>;
    } & {
      [P in K2]: DefinitionShapeFromTupleValue<Keys, TTuple, 2>;
    } & (Rest extends readonly [infer K3 extends string, ...infer R4 extends string[]]
        ? { [P in K3]: DefinitionShapeFromTupleValue<Keys, TTuple, 3> } & (R4 extends readonly [
                infer K4 extends string,
              ]
              ? { [P in K4]: DefinitionShapeFromTupleValue<Keys, TTuple, 4> }
              : object)
        : object)
  : Keys extends readonly [infer K0 extends string, infer K1 extends string]
    ? { [P in K0]: DefinitionShapeFromTupleValue<Keys, TTuple, 0> } & {
        [P in K1]: DefinitionShapeFromTupleValue<Keys, TTuple, 1>;
      }
    : Keys extends readonly [infer K0 extends string]
      ? { [P in K0]: DefinitionShapeFromTupleValue<Keys, TTuple, 0> }
      : object;

/**
 * Definition shape built from a tuple of resolved types so that context for index I
 * uses tuple[0..I-1]. Intersection form ensures each key gets the correct type.
 */
export type DefinitionShapeFromTuple<
  Keys extends readonly string[],
  TTuple extends readonly unknown[],
> = DefinitionShapeFromTupleIntersection<Keys, TTuple> & Record<string, unknown>;

/**
 * Definition record from tuple (for instance typing). Resolved<DefinitionFromTuple[K]> = TTuple[I].
 */
type DefinitionFromTuple<
  Keys extends readonly string[],
  TTuple extends readonly unknown[],
> = DefinitionShapeFromTupleIntersection<Keys, TTuple> & Record<string, unknown>;

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

/** Instance with narrowed accessor keys (resolved from TDefinition) and internals. */
export type StructureInstanceWithKeys<
  TOrderedKeys extends readonly string[],
  TDefinition extends Record<string, unknown> = Record<string, unknown>,
> = { [K in TOrderedKeys[number]]: Resolved<TDefinition[K]> } & {
  [K in TOrderedKeys[number] as `_${K}`]: Resolved<TDefinition[K]>;
} & {
  _structureAccessorsConfig: StructureAccessorsConfigShape<TOrderedKeys>;
};

/** Return type of the create function; useComposable returns instance typed from TDefinition. */
export interface CreateStructureResult<
  TOrderedKeys extends readonly string[],
  TDefinition extends Record<string, unknown> = Record<string, unknown>,
> {
  useComposable: (initProps?: unknown) => StructureInstanceWithKeys<TOrderedKeys, TDefinition>;
}

/** Extracts TDefinition from a CreateStructureResult (e.g. from result of create(factory)). */
export type DefinitionFromResult<R> =
  R extends CreateStructureResult<readonly string[], infer D> ? D : never;

/** Create function: tuple overload first (inference when TTuple provided), then legacy DefinitionShape. */
export type CreateStructureFn<Keys extends readonly string[]> = {
  <TTuple extends readonly [unknown, ...unknown[]]>(
    factory: () => DefinitionShapeFromTuple<Keys, TTuple>
  ): CreateStructureResult<Keys, DefinitionFromTuple<Keys, TTuple>>;
  <TDefinition extends DefinitionShape<Keys, TDefinition> &
    Record<Keys[number], unknown> &
    Record<string, unknown>>(
    factory: () => DefinitionShape<Keys, TDefinition>
  ): CreateStructureResult<Keys, TDefinition>;
};

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
): CreateStructureFn<OrderedKeysFromEntries<TEntries>> {
  const entries = structureConfigFactoryFn({ StructureAccessorPresets });
  const structureAccessorsConfig = defineColadaStructureAccessorsConfigMap(...entries);
  type TOrderedKeys = OrderedKeysFromEntries<TEntries>;
  const createStructure = function (
    definitionFactory: () =>
      | DefinitionShapeFromTuple<TOrderedKeys, unknown[]>
      | DefinitionShape<TOrderedKeys, Record<string, unknown>>
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
        return instance as StructureInstanceWithKeys<TOrderedKeys, Record<string, unknown>>;
      },
    };
  };
  return createStructure as CreateStructureFn<TOrderedKeys>;
}
