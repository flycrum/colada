/**
 * Type tests for defineColadaState. Assert only on types that flow from calling the API.
 * See [Vitest testing types](https://vitest.dev/guide/testing-types) and [.agents/plugins/vitest](../../../.agents/plugins/vitest).
 */

import { assertType, expectTypeOf, test } from 'vitest';
import { defineColadaState } from './define-colada-state';
import type { StructureInstance } from './define-colada-structure';

test('defineColadaState is a function', () => {
  expectTypeOf(defineColadaState).toBeFunction();
});

test('defineColadaState accepts a factory whose return type extends Record<string, unknown>', () => {
  expectTypeOf(defineColadaState).parameter(0).toBeFunction();
  expectTypeOf(defineColadaState).parameter(0).returns.toExtend<Record<string, unknown>>();
});

test('defineColadaState return has useComposable returning StructureInstance', () => {
  const result = defineColadaState(() => ({
    name: 'x',
    state: () => ({}),
    getters: () => ({}),
    helpers: () => ({}),
    actions: () => ({}),
    hooks: () => ({}),
  }));
  expectTypeOf(result).toHaveProperty('useComposable');
  expectTypeOf(result.useComposable).toBeFunction();
  expectTypeOf(result.useComposable()).toEqualTypeOf<StructureInstance>();
});

test('instance from useComposable has public and internal accessors', () => {
  const instance = defineColadaState(() => ({
    name: 'x',
    state: () => ({}),
    getters: () => ({}),
    helpers: () => ({}),
    actions: () => ({}),
    hooks: () => ({}),
  })).useComposable();
  expectTypeOf(instance).toHaveProperty('name');
  expectTypeOf(instance).toHaveProperty('state');
  expectTypeOf(instance).toHaveProperty('getters');
  expectTypeOf(instance).toHaveProperty('helpers');
  expectTypeOf(instance).toHaveProperty('actions');
  expectTypeOf(instance).toHaveProperty('hooks');
  expectTypeOf(instance).toHaveProperty('_name');
  expectTypeOf(instance).toHaveProperty('_state');
  expectTypeOf(instance).toHaveProperty('_getters');
  expectTypeOf(instance).toHaveProperty('_helpers');
  expectTypeOf(instance).toHaveProperty('_actions');
  expectTypeOf(instance).toHaveProperty('_hooks');
  expectTypeOf(instance).toHaveProperty('_structureAccessorsConfig');
});

test('instance state property is present (typed as unknown until instance is generic)', () => {
  const instance = defineColadaState(() => ({
    name: 'x',
    state: () => ({}),
    getters: () => ({}),
    helpers: () => ({}),
    actions: () => ({}),
    hooks: () => ({}),
  })).useComposable();
  expectTypeOf(instance).toHaveProperty('state');
  assertType<unknown>((instance as Record<string, unknown>).state);
});
