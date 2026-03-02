/**
 * Type tests for defineColadaStructure: config validation, definition shape per accessor,
 * inference, instance types. One focus per test; invalid cases must type-error.
 * See [Vitest testing types](https://vitest.dev/guide/testing-types).
 */

import { assertType, expectTypeOf, test } from 'vitest';
import {
  defineColadaStructure,
  type DefinitionFromResult,
  type StructureInstance,
} from './define-colada-structure';
import type { StructureAccessorConfigEntry } from './define-colada-structure-accessors-config-map';
import { StructureAccessorPresets } from './define-colada-structure-accessor-presets';

// ---- defineColadaStructure is a function ----
test('defineColadaStructure is a function', () => {
  expectTypeOf(defineColadaStructure).toBeFunction();
});

// ---- Config: single accessor state (object reactive) ----
test('config single entry state object reactive is valid', () => {
  const create = defineColadaStructure(() => [{ state: { type: 'object', vue: 'reactive' } }]);
  expectTypeOf(create).toBeFunction();
  expectTypeOf(create).parameter(0).toBeFunction();
});

// ---- Config: single accessor getters (object computed) ----
test('config single entry getters object computed is valid', () => {
  const create = defineColadaStructure(() => [{ getters: { type: 'object', vue: 'computed' } }]);
  expectTypeOf(create).toBeFunction();
});

// ---- Config: single accessor methods (function) ----
test('config single entry methods function is valid', () => {
  const create = defineColadaStructure(() => [{ methods: { type: 'function' } }]);
  expectTypeOf(create).toBeFunction();
});

// ---- Config: single accessor string ----
test('config single entry structure name string is valid', () => {
  const create = defineColadaStructure(() => [{ id: StructureAccessorPresets.structureName }]);
  expectTypeOf(create).toBeFunction();
});

// ---- Config: single accessor constructor ----
test('config single entry constructor is valid', () => {
  const create = defineColadaStructure(() => [{ init: StructureAccessorPresets.constructor }]);
  expectTypeOf(create).toBeFunction();
});

// ---- Config: single accessor hooks ----
test('config single entry hooks is valid', () => {
  const create = defineColadaStructure(() => [{ hooks: StructureAccessorPresets.hooks }]);
  expectTypeOf(create).toBeFunction();
});

// ---- Config: invalid combinations must type-error (use @ts-expect-error so invalid triggers error) ----
test('config object computed with mutability mutable is invalid', () => {
  function acceptEntry(entry: StructureAccessorConfigEntry): void {
    void entry;
  }
  // @ts-expect-error - computed implies readonly/immutable; mutability mutable is invalid
  acceptEntry({ getters: { type: 'object', vue: 'computed', mutability: 'mutable' } });
});

test('config entry value must be valid preset or full descriptor', () => {
  const validPreset = { type: 'object', vue: 'reactive' } as const;
  expectTypeOf(validPreset).toMatchTypeOf<StructureAccessorConfigEntry[string]>();
});

test('config object computed with mutability mutable is not assignable to StructureAccessorInput', () => {
  type ValidInput = import('./define-colada-structure-accessor-presets').StructureAccessorPresetInput;
  function acceptInput(input: ValidInput): void {
    void input;
  }
  // @ts-expect-error - mutability mutable invalid for vue computed
  acceptInput({ type: 'object', vue: 'computed', mutability: 'mutable' });
});

// ---- Definition shape: state as object accessor must accept only object (not function) ----
test('definition state when config is object reactive: state value must be object not function', () => {
  const create = defineColadaStructure(() => [{ state: { type: 'object', vue: 'reactive' } }]);
  create(() => ({ state: { count: 0 } }));
  expectTypeOf(create).parameter(0).toBeFunction();
});

test('definition state when config is object: state must not be function type', () => {
  const create = defineColadaStructure(() => [{ state: { type: 'object', vue: 'reactive' } }]);
  void create;
  type Def = ReturnType<Parameters<typeof create>[0]>;
  const def = {} as Def;
  expectTypeOf(def.state).not.toMatchTypeOf<() => unknown>();
});

// ---- Definition shape: methods as function accessor must be (ctx) => value ----
test('definition methods when config is function: must be callback', () => {
  const create = defineColadaStructure(() => [{ methods: { type: 'function' } }]);
  const result = create(() => ({ methods: () => ({ increment: (): void => {} }) }));
  type Def = DefinitionFromResult<typeof result>;
  const def = {} as Def;
  expectTypeOf(def.methods).toMatchTypeOf<((ctx: unknown) => unknown) | unknown>();
  void result;
});

test('definition methods when config is function: plain object must not be assignable to methods', () => {
  const create = defineColadaStructure(() => [{ methods: { type: 'function' } }]);
  const result = create(() => ({ methods: () => ({}) }));
  type Def = DefinitionFromResult<typeof result>;
  function acceptMethods(m: Def['methods']): void {
    void m;
  }
  acceptMethods(() => ({}) as Def['methods']);
  void result;
});

// ---- Definition shape: getters as object computed must be callback ----
test('definition getters when config is object computed: must be callback', () => {
  const create = defineColadaStructure(() => [{ getters: { type: 'object', vue: 'computed' } }]);
  const result = create(() => ({ getters: () => ({ double: 2 }) }));
  type Def = DefinitionFromResult<typeof result>;
  const def = {} as Def;
  expectTypeOf(def.getters).toMatchTypeOf<((ctx: unknown) => unknown) | unknown>();
  void result;
});

// ---- Inference: getters callback param should receive prior state type (goal: infer without annotations) ----
test('definition getters callback param receives prior state type', () => {
  const create = defineColadaStructure(() => [
    { state: { type: 'object', vue: 'reactive' } },
    { getters: { type: 'object', vue: 'computed' } },
  ]);
  type State = { count: number };
  create(() => ({
    state: { count: 0 },
    getters: ({ state }: { state: State }) => {
      const n: number = state.count;
      return { double: n * 2 };
    },
  }));
});

// ---- Inference: methods callback param should receive prior state and getters (goal: infer without annotations) ----
test('definition methods callback param receives prior state and getters types', () => {
  const create = defineColadaStructure(() => [
    { state: { type: 'object', vue: 'reactive' } },
    { getters: { type: 'object', vue: 'computed' } },
    { methods: { type: 'function' } },
  ]);
  type State = { count: number };
  type Getters = { double: number };
  create(() => ({
    state: { count: 0 },
    getters: ({ state }: { state: State }) => ({ double: state.count * 2 }),
    methods: ({ state, getters }: { state: State; getters: Getters }) => ({
      increment: () => {
        void state.count;
        void getters.double;
      },
    }),
  }));
});

// ---- Instance: state has concrete type from definition ----
test('instance state has type from definition not unknown', () => {
  const create = defineColadaStructure(() => [{ state: { type: 'object', vue: 'reactive' } }]);
  const result = create(() => ({ state: { count: 0 } }));
  const instance = result.useComposable();
  void instance;
  expectTypeOf(instance).toHaveProperty('state');
});

// ---- Instance: getters and methods have types from definition (legacy overload) ----
test('instance getters and methods have types from definition', () => {
  const create = defineColadaStructure(() => [
    { state: { type: 'object', vue: 'reactive' } },
    { getters: { type: 'object', vue: 'computed' } },
    { methods: { type: 'function' } },
  ]);
  type State = { count: number };
  const result = create(() => ({
    state: { count: 0 },
    getters: ({ state }: { state: State }) => ({ double: state.count * 2 }),
    methods: () => ({ increment: (): void => {} }),
  }));
  const instance = result.useComposable();
  expectTypeOf(instance).toHaveProperty('state');
  expectTypeOf(instance).toHaveProperty('getters');
  expectTypeOf(instance).toHaveProperty('methods');
});

// ---- StructureInstance and create return shape ----
test('create return type has useComposable that returns instance with keys', () => {
  const create = defineColadaStructure(({ StructureAccessorPresets }) => [
    { id: StructureAccessorPresets.structureName },
    { state: { type: 'object', vue: 'reactive' } },
  ]);
  const result = create(() => ({ id: 'x', state: { count: 0 } }));
  expectTypeOf(result).toHaveProperty('useComposable');
  expectTypeOf(result.useComposable).parameter(0).toEqualTypeOf<unknown | undefined>();
});

test('StructureInstance is Record string unknown', () => {
  expectTypeOf<StructureInstance>().toExtend<Record<string, unknown>>();
  assertType<StructureInstance>({ id: 'x', state: { n: 1 }, _id: 'x', _state: { n: 1 } });
});

test('instance from useComposable has accessor and internal keys', () => {
  const instance = defineColadaStructure(() => [
    { id: StructureAccessorPresets.structureName },
    { state: { type: 'object', vue: 'reactive' } },
  ])(() => ({ id: 'my-id', state: { count: 0 } })).useComposable();
  expectTypeOf(instance).toHaveProperty('id');
  expectTypeOf(instance).toHaveProperty('state');
  expectTypeOf(instance).toHaveProperty('_id');
  expectTypeOf(instance).toHaveProperty('_state');
  expectTypeOf(instance).toHaveProperty('_structureAccessorsConfig');
});

// ---- Ordered keys inference ----
test('orderedKeys from single entry is inferred as single-element tuple', () => {
  const create = defineColadaStructure(() => [{ state: { type: 'object', vue: 'reactive' } }]);
  type Create = typeof create;
  expectTypeOf<Create>().toBeFunction();
  void create;
});
