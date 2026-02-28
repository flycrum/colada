/**
 * Type tests for structure accessor presets and normalizeStructureAccessor.
 */

import { expectTypeOf, test } from 'vitest';
import {
  StructureAccessorPresets,
  normalizeStructureAccessor,
  type StructureAccessorInput,
  type StructureAccessorPresetInput,
} from './define-colada-structure-accessor-presets';
import type {
  StructureAccessorAllUnion,
  StructureAccessorConstructor,
  StructureAccessorFunction,
  StructureAccessorHooks,
  StructureAccessorObjectReadonlyVueComputed,
  StructureAccessorObjectReadonlyVueReactive,
  StructureAccessorString,
} from './define-colada-structure-accessor-types';

test('StructureAccessorPresets.stateReactiveReadonly satisfies StructureAccessorObjectReadonlyVueReactive', () => {
  expectTypeOf(
    StructureAccessorPresets.stateReactiveReadonly
  ).toMatchTypeOf<StructureAccessorObjectReadonlyVueReactive>();
});

test('StructureAccessorPresets.gettersComputed satisfies StructureAccessorObjectReadonlyVueComputed', () => {
  expectTypeOf(
    StructureAccessorPresets.gettersComputed
  ).toMatchTypeOf<StructureAccessorObjectReadonlyVueComputed>();
});

test('StructureAccessorPresets.methodsPublic satisfies StructureAccessorFunction', () => {
  expectTypeOf(StructureAccessorPresets.methodsPublic).toMatchTypeOf<StructureAccessorFunction>();
});

test('StructureAccessorPresets.structureName satisfies StructureAccessorString', () => {
  expectTypeOf(StructureAccessorPresets.structureName).toMatchTypeOf<StructureAccessorString>();
});

test('StructureAccessorPresets.constructor satisfies StructureAccessorConstructor', () => {
  expectTypeOf(StructureAccessorPresets.constructor).toMatchTypeOf<StructureAccessorConstructor>();
});

test('StructureAccessorPresets.hooks satisfies StructureAccessorHooks', () => {
  expectTypeOf(StructureAccessorPresets.hooks).toMatchTypeOf<StructureAccessorHooks>();
});

test('normalizeStructureAccessor accepts preset input and returns StructureAccessorAllUnion', () => {
  expectTypeOf(normalizeStructureAccessor).parameter(0).toMatchTypeOf<StructureAccessorInput>();
  expectTypeOf(normalizeStructureAccessor).returns.toMatchTypeOf<StructureAccessorAllUnion>();
});

test('preset input object reactive is assignable to StructureAccessorInput', () => {
  const input: StructureAccessorInput = { type: 'object', vue: 'reactive' };
  expectTypeOf(input).toMatchTypeOf<StructureAccessorPresetInput>();
});

test('preset input object computed is assignable to StructureAccessorInput', () => {
  const input: StructureAccessorInput = { type: 'object', vue: 'computed' };
  expectTypeOf(input).toMatchTypeOf<StructureAccessorPresetInput>();
});

test('preset input function is assignable to StructureAccessorInput', () => {
  const input: StructureAccessorInput = { type: 'function' };
  expectTypeOf(input).toMatchTypeOf<StructureAccessorPresetInput>();
});
