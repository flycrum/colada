/**
 * Type tests for defineColadaStructure and StructureInstance.
 * See [Vitest testing types](https://vitest.dev/guide/testing-types).
 */

import { assertType, expectTypeOf, test } from 'vitest';
import { defineColadaStructure, type StructureInstance } from './define-colada-structure';

test('defineColadaStructure is a function', () => {
  expectTypeOf(defineColadaStructure).toBeFunction();
});

test('defineColadaStructure accepts structureConfigFactoryFn and returns a create function', () => {
  const create = defineColadaStructure(({ StructureAccessorPresets }) => [
    { id: StructureAccessorPresets.structureName },
    { state: { type: 'object', vue: 'reactive' } },
  ]);
  expectTypeOf(create).toBeFunction();
  expectTypeOf(create).parameter(0).toBeFunction();
  expectTypeOf(create).parameter(0).returns.toExtend<Record<string, unknown>>();
});

test('create return type has useComposable that returns StructureInstance', () => {
  const create = defineColadaStructure(({ StructureAccessorPresets }) => [
    { id: StructureAccessorPresets.structureName },
    { state: { type: 'object', vue: 'reactive' } },
  ]);
  const result = create(() => ({
    id: 'test',
    state: () => ({ count: 0 }),
  }));
  expectTypeOf(result).toHaveProperty('useComposable');
  expectTypeOf(result.useComposable).toBeFunction();
  expectTypeOf(result.useComposable).parameter(0).toEqualTypeOf<unknown | undefined>();
  // useComposable return type asserted via instance key tests below
});

test('StructureInstance is a Record with string keys and unknown values', () => {
  expectTypeOf<StructureInstance>().toExtend<Record<string, unknown>>();
  const instance: StructureInstance = { id: 'x', state: { n: 1 }, _id: 'x', _state: { n: 1 } };
  assertType<StructureInstance>(instance);
});

test('instance from useComposable has expected accessor and internal keys', () => {
  const instance = defineColadaStructure(({ StructureAccessorPresets }) => [
    { id: StructureAccessorPresets.structureName },
    { state: { type: 'object', vue: 'reactive' } },
  ])(() => ({
    id: 'my-id',
    state: () => ({ count: 0 }),
  })).useComposable();
  expectTypeOf(instance).toHaveProperty('id');
  expectTypeOf(instance).toHaveProperty('state');
  expectTypeOf(instance).toHaveProperty('_id');
  expectTypeOf(instance).toHaveProperty('_state');
  expectTypeOf(instance).toHaveProperty('_structureAccessorsConfig');
});

test('definition factory getters and methods accept prior context types', () => {
  const create = defineColadaStructure((context) => [
    { state: context.StructureAccessorPresets.stateReactiveReadonly },
    { getters: context.StructureAccessorPresets.gettersComputed },
    { methods: context.StructureAccessorPresets.methodsPublic },
  ]);
  type State = { count: number };
  type Getters = { double: () => number };
  create(() => ({
    state: { count: 0 },
    getters: ({ state }: { state: State }) => {
      const n: number = state.count;
      return { double: (): number => n * 2 };
    },
    methods: ({ state, getters }: { state: State; getters: Getters }) => {
      void state.count;
      void getters.double();
      return { increment: (): void => {} };
    },
  }));
});
