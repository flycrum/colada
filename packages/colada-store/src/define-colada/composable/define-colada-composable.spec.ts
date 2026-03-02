import { describe, expect, it } from 'vitest';
import { defineColadaComposable } from './define-colada-composable';

describe('defineColadaComposable', () => {
  it('is a function', () => {
    expect(typeof defineColadaComposable).toBe('function');
  });

  it('returns useComposable that accepts optional init props', () => {
    const result = defineColadaComposable(() => ({
      name: 'my-composable',
      state: () => ({}),
      getters: () => ({}),
      helpers: () => ({}),
      actions: () => ({}),
      hooks: () => ({}),
      constructor: () => ({}),
    }));
    expect(result).toHaveProperty('useComposable');
    const instance = result.useComposable();
    expect(instance.name).toBe('my-composable');
    const withProps = result.useComposable({ user: null });
    expect(withProps).toBeDefined();
  });
});
