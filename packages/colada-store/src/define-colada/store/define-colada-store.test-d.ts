/**
 * Type tests for defineColadaStore. Assert only on types that flow from calling the API.
 * See [Vitest testing types](https://vitest.dev/guide/testing-types) and [.agents/plugins/vitest](../../../../.agents/plugins/vitest).
 */

import { expectTypeOf, test } from 'vitest';
import type { StructureInstance } from '../structure/define-colada-structure';
import { defineColadaStore } from './define-colada-store';

test('defineColadaStore is a function', () => {
  expectTypeOf(defineColadaStore).toBeFunction();
});

test('defineColadaStore return has useComposable returning StructureInstance', () => {
  const result = defineColadaStore(() => ({
    id: 'x',
    deps: () => ({}),
    constants: () => ({}),
    state: () => ({}),
    getters: () => ({}),
    helpers: () => ({}),
    actions: () => ({}),
    hooks: () => ({}),
    constructor: () => {},
  }));
  expectTypeOf(result).toHaveProperty('useComposable');
  expectTypeOf(result.useComposable()).toEqualTypeOf<StructureInstance>();
});

test('instance has public and internal accessors including constructor-related', () => {
  const instance = defineColadaStore(() => ({
    id: 'x',
    deps: () => ({}),
    constants: () => ({}),
    state: () => ({}),
    getters: () => ({}),
    helpers: () => ({}),
    actions: () => ({}),
    hooks: () => ({}),
    constructor: () => {},
  })).useComposable();
  expectTypeOf(instance).toHaveProperty('id');
  expectTypeOf(instance).toHaveProperty('deps');
  expectTypeOf(instance).toHaveProperty('constants');
  expectTypeOf(instance).toHaveProperty('state');
  expectTypeOf(instance).toHaveProperty('getters');
  expectTypeOf(instance).toHaveProperty('helpers');
  expectTypeOf(instance).toHaveProperty('actions');
  expectTypeOf(instance).toHaveProperty('hooks');
  expectTypeOf(instance).toHaveProperty('_id');
  expectTypeOf(instance).toHaveProperty('_state');
  expectTypeOf(instance).toHaveProperty('_getters');
  expectTypeOf(instance).toHaveProperty('_constructor');
  expectTypeOf(instance).toHaveProperty('_structureAccessorsConfig');
});

test('useComposable accepts optional initProps', () => {
  const result = defineColadaStore(() => ({
    id: 'x',
    deps: () => ({}),
    constants: () => ({}),
    state: () => ({}),
    getters: () => ({}),
    helpers: () => ({}),
    actions: () => ({}),
    hooks: () => ({}),
    constructor: () => {},
  }));
  expectTypeOf(result.useComposable).toBeCallableWith();
  expectTypeOf(result.useComposable).toBeCallableWith(undefined);
  expectTypeOf(result.useComposable).parameter(0).toEqualTypeOf<unknown | undefined>();
});
