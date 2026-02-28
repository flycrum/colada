/**
 * Type tests for defineColadaStructureAccessorsConfigMap and related types.
 * See [Vitest testing types](https://vitest.dev/guide/testing-types).
 */

import { expectTypeOf, test } from 'vitest';
import { StructureAccessorPresets } from './define-colada-structure-accessor-presets';
import type { StructureAccessorAllUnion } from './define-colada-structure-accessor-types';
import {
  defineColadaStructureAccessorsConfigMap,
  type StructureAccessorConfigEntry,
  type StructureAccessorsConfigShape,
} from './define-colada-structure-accessors-config-map';

test('defineColadaStructureAccessorsConfigMap is a function', () => {
  expectTypeOf(defineColadaStructureAccessorsConfigMap).toBeFunction();
});

test('config return type satisfies StructureAccessorsConfigShape with inferred ordered keys', () => {
  const config = defineColadaStructureAccessorsConfigMap(
    { id: StructureAccessorPresets.structureName },
    { deps: StructureAccessorPresets.objectWritable },
    { state: { type: 'object', vue: 'reactive' } }
  );
  expectTypeOf(config).toExtend<StructureAccessorsConfigShape<readonly ['id', 'deps', 'state']>>();
  expectTypeOf(config.orderedKeys).toEqualTypeOf<readonly ['id', 'deps', 'state']>();
  expectTypeOf(config.size).toBeNumber();
  expectTypeOf(config.get).toBeFunction();
  expectTypeOf(config.getByIndex).toBeFunction();
});

test('get returns StructureAccessorAllUnion | undefined', () => {
  const config = defineColadaStructureAccessorsConfigMap(
    { id: StructureAccessorPresets.structureName },
    { state: { type: 'object', vue: 'reactive' } }
  );
  expectTypeOf(config.get).parameters.toEqualTypeOf<[string]>();
  expectTypeOf(config.get).returns.toEqualTypeOf<StructureAccessorAllUnion | undefined>();
});

test('getByIndex returns tuple or undefined', () => {
  const config = defineColadaStructureAccessorsConfigMap(
    { id: StructureAccessorPresets.structureName },
    { state: { type: 'object', vue: 'reactive' } }
  );
  expectTypeOf(config.getByIndex).parameters.toEqualTypeOf<[number]>();
  expectTypeOf(config.getByIndex).returns.toEqualTypeOf<
    [key: string, type: StructureAccessorAllUnion] | undefined
  >();
});

test('orderedKeys is a readonly tuple of string literals', () => {
  const config = defineColadaStructureAccessorsConfigMap(
    { name: StructureAccessorPresets.structureName },
    { state: { type: 'object', vue: 'reactive' } },
    { getters: { type: 'object', vue: 'computed' } }
  );
  expectTypeOf(config.orderedKeys).toEqualTypeOf<readonly ['name', 'state', 'getters']>();
  expectTypeOf(config.orderedKeys).items.toBeString();
});

test('entries accept preset objects or inline preset input', () => {
  const config = defineColadaStructureAccessorsConfigMap(
    { state: { type: 'object', vue: 'reactive' } },
    { getters: StructureAccessorPresets.gettersComputed },
    { methods: { type: 'function' } }
  );
  expectTypeOf(config.orderedKeys).toEqualTypeOf<readonly ['state', 'getters', 'methods']>();
});

test('StructureAccessorConfigEntry is Record<string, StructureAccessorInput>', () => {
  const entry: StructureAccessorConfigEntry = { state: { type: 'object', vue: 'reactive' } };
  expectTypeOf(entry).toHaveProperty('state');
});
