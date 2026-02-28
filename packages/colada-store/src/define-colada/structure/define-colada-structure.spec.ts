import { describe, expect, it } from 'vitest';
import { defineColadaStructure } from './define-colada-structure';

describe('defineColadaStructure', () => {
  it('is a function', () => {
    expect(typeof defineColadaStructure).toBe('function');
  });

  it('returns a factory that accepts a definition and returns useComposable', () => {
    const create = defineColadaStructure(({ StructureAccessorPresets }) => [
      { id: StructureAccessorPresets.structureName },
      { state: { type: 'object', vue: 'reactive' } },
    ]);
    const result = create(() => ({
      id: 'test',
      state: () => ({ count: 0 }),
    }));
    expect(result).toHaveProperty('useComposable');
    expect(typeof result.useComposable).toBe('function');
    const instance = result.useComposable();
    expect(instance).toBeDefined();
    expect(instance.id).toBe('test');
    expect((instance as Record<string, unknown>).state).toEqual({ count: 0 });
  });

  it('passes prior accessors as context to factory functions', () => {
    const create = defineColadaStructure(({ StructureAccessorPresets }) => [
      { id: StructureAccessorPresets.structureName },
      { state: { type: 'object', vue: 'reactive' } },
      { getters: { type: 'object', vue: 'computed' } },
    ]);
    let gettersContext: unknown = null;
    const result = create(() => ({
      id: 'my-id',
      state: () => ({ n: 1 }),
      getters: (ctx: unknown) => {
        gettersContext = ctx;
        return { double: () => 2 };
      },
    }));
    result.useComposable();
    expect(gettersContext).toEqual({
      id: 'my-id',
      state: { n: 1 },
    });
  });

  it('exposes _structureAccessorsConfig on instance', () => {
    const create = defineColadaStructure(({ StructureAccessorPresets }) => [
      { id: StructureAccessorPresets.structureName },
    ]);
    const instance = create(() => ({ id: 'x' })).useComposable();
    const config = (instance as Record<string, unknown>)._structureAccessorsConfig as {
      orderedKeys: readonly string[];
    };
    expect(config).toBeDefined();
    expect(config.orderedKeys).toEqual(['id']);
  });

  it('exposes dynamic internals _accessorName per config key', () => {
    const create = defineColadaStructure(({ StructureAccessorPresets }) => [
      { id: StructureAccessorPresets.structureName },
      { state: StructureAccessorPresets.objectWritable },
    ]);
    const instance = create(() => ({
      id: 'store-1',
      state: () => ({ value: 10 }),
    })).useComposable() as Record<string, unknown>;
    expect(instance._id).toBe('store-1');
    expect(instance._state).toEqual({ value: 10 });
  });
});
