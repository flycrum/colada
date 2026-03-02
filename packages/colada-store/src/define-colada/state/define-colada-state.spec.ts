import { describe, expect, it } from 'vitest';
import { defineColadaState } from './define-colada-state';

describe('defineColadaState', () => {
  it('is a function', () => {
    expect(typeof defineColadaState).toBe('function');
  });

  it('returns useComposable that returns a remapped instance with name', () => {
    const result = defineColadaState(() => ({
      name: 'my-state',
      state: () => ({}),
      getters: () => ({}),
      helpers: () => ({}),
      actions: () => ({}),
      hooks: () => ({}),
    }));
    expect(result).toHaveProperty('useComposable');
    const instance = result.useComposable();
    expect(instance.name).toBe('my-state');
  });
});
