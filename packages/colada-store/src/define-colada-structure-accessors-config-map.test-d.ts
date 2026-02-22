/**
 * Type tests for defineColadaStructureAccessorsConfigMap and related types.
 * See [Vitest testing types](https://vitest.dev/guide/testing-types).
 */

import { assertType, expectTypeOf, test } from 'vitest';
import {
  defineColadaStructureAccessorsConfigMap,
  StructureAccessorTypes,
  type StructureAccessorsConfigShape,
  type StructureAccessorType,
} from './define-colada-structure-accessors-config-map';

test('defineColadaStructureAccessorsConfigMap is a function', () => {
  expectTypeOf(defineColadaStructureAccessorsConfigMap).toBeFunction();
});

test('config return type satisfies StructureAccessorsConfigShape with inferred ordered keys', () => {
  const config = defineColadaStructureAccessorsConfigMap(
    { id: StructureAccessorTypes.STRUCTURE_NAME },
    { deps: StructureAccessorTypes.OBJECT },
    { state: StructureAccessorTypes.OBJECT_REACTIVE_READONLY }
  );
  expectTypeOf(config).toExtend<StructureAccessorsConfigShape<readonly ['id', 'deps', 'state']>>();
  expectTypeOf(config.orderedKeys).toEqualTypeOf<readonly ['id', 'deps', 'state']>();
  expectTypeOf(config.size).toBeNumber();
  expectTypeOf(config.get).toBeFunction();
  expectTypeOf(config.getByIndex).toBeFunction();
});

test('get returns StructureAccessorType | undefined', () => {
  const config = defineColadaStructureAccessorsConfigMap(
    { id: StructureAccessorTypes.STRUCTURE_NAME },
    { state: StructureAccessorTypes.OBJECT }
  );
  expectTypeOf(config.get).parameters.toEqualTypeOf<[string]>();
  expectTypeOf(config.get).returns.toEqualTypeOf<StructureAccessorType | undefined>();
});

test('getByIndex returns tuple or undefined', () => {
  const config = defineColadaStructureAccessorsConfigMap(
    { id: StructureAccessorTypes.STRUCTURE_NAME },
    { state: StructureAccessorTypes.OBJECT }
  );
  expectTypeOf(config.getByIndex).parameters.toEqualTypeOf<[number]>();
  expectTypeOf(config.getByIndex).returns.toEqualTypeOf<
    [key: string, type: StructureAccessorType] | undefined
  >();
});

test('orderedKeys is a readonly tuple of string literals', () => {
  const config = defineColadaStructureAccessorsConfigMap(
    { name: StructureAccessorTypes.STRUCTURE_NAME },
    { state: StructureAccessorTypes.OBJECT_REACTIVE_READONLY },
    { getters: StructureAccessorTypes.OBJECT_COMPUTED }
  );
  expectTypeOf(config.orderedKeys).toEqualTypeOf<readonly ['name', 'state', 'getters']>();
  expectTypeOf(config.orderedKeys).items.toBeString();
});

test('StructureAccessorTypes constants are StructureAccessorType', () => {
  assertType<StructureAccessorType>(StructureAccessorTypes.STRUCTURE_NAME);
  assertType<StructureAccessorType>(StructureAccessorTypes.OBJECT);
  assertType<StructureAccessorType>(StructureAccessorTypes.OBJECT_READONLY);
  assertType<StructureAccessorType>(StructureAccessorTypes.OBJECT_REACTIVE_READONLY);
  assertType<StructureAccessorType>(StructureAccessorTypes.OBJECT_COMPUTED);
  assertType<StructureAccessorType>(StructureAccessorTypes.METHODS_INTERNAL);
  assertType<StructureAccessorType>(StructureAccessorTypes.METHODS);
  assertType<StructureAccessorType>(StructureAccessorTypes.HOOKS);
  assertType<StructureAccessorType>(StructureAccessorTypes.CONSTRUCTOR);
});
