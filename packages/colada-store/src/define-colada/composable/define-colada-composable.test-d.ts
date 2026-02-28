/**
 * Type tests for defineColadaComposable. Assert only on types that flow from calling the API.
 * See [Vitest testing types](https://vitest.dev/guide/testing-types) and [.agents/plugins/vitest](../../../../.agents/plugins/vitest).
 */

import { expectTypeOf, test } from 'vitest';
import type { StructureInstance } from '../structure/define-colada-structure';
import { defineColadaComposable } from './define-colada-composable';

test('defineColadaComposable is a function', () => {
  expectTypeOf(defineColadaComposable).toBeFunction();
});

test('defineColadaComposable return has useComposable returning StructureInstance', () => {
  const result = defineColadaComposable(() => ({
    name: 'x',
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

test('instance has public accessors and internal _-prefixed and _structureAccessorsConfig', () => {
  const instance = defineColadaComposable(() => ({
    name: 'x',
    state: () => ({}),
    getters: () => ({}),
    helpers: () => ({}),
    actions: () => ({}),
    hooks: () => ({}),
    constructor: () => {},
  })).useComposable();
  expectTypeOf(instance).toHaveProperty('name');
  expectTypeOf(instance).toHaveProperty('state');
  expectTypeOf(instance).toHaveProperty('getters');
  expectTypeOf(instance).toHaveProperty('helpers');
  expectTypeOf(instance).toHaveProperty('actions');
  expectTypeOf(instance).toHaveProperty('hooks');
  expectTypeOf(instance).toHaveProperty('_name');
  expectTypeOf(instance).toHaveProperty('_state');
  expectTypeOf(instance).toHaveProperty('_constructor');
  expectTypeOf(instance).toHaveProperty('_structureAccessorsConfig');
});

test('useComposable accepts optional initProps for constructor', () => {
  const result = defineColadaComposable(() => ({
    name: 'x',
    state: () => ({}),
    getters: () => ({}),
    helpers: () => ({}),
    actions: () => ({}),
    hooks: () => ({}),
    constructor: () => {},
  }));
  expectTypeOf(result.useComposable).toBeCallableWith();
  expectTypeOf(result.useComposable).toBeCallableWith({});
  expectTypeOf(result.useComposable).parameter(0).toEqualTypeOf<unknown | undefined>();
});
