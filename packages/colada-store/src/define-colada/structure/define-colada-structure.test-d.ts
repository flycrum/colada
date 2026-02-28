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
  const create = defineColadaStructure(({ StructureAccessorTypes }) => [
    { id: StructureAccessorTypes.STRUCTURE_NAME },
    { state: StructureAccessorTypes.OBJECT_REACTIVE_READONLY },
  ]);
  expectTypeOf(create).toBeFunction();
  expectTypeOf(create).parameter(0).toBeFunction();
  expectTypeOf(create).parameter(0).returns.toExtend<Record<string, unknown>>();
});

test('create return type has useComposable that returns StructureInstance', () => {
  const create = defineColadaStructure(({ StructureAccessorTypes }) => [
    { id: StructureAccessorTypes.STRUCTURE_NAME },
    { state: StructureAccessorTypes.OBJECT_REACTIVE_READONLY },
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
  const instance = defineColadaStructure(({ StructureAccessorTypes }) => [
    { id: StructureAccessorTypes.STRUCTURE_NAME },
    { state: StructureAccessorTypes.OBJECT_REACTIVE_READONLY },
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
