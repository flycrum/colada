import { describe, expect, it } from 'vitest';
import { StructureAccessorPresets } from './define-colada-structure-accessor-presets';
import type { StructureAccessorAllUnion } from './define-colada-structure-accessor-types';
import { defineColadaStructureAccessorsConfigMap } from './define-colada-structure-accessors-config-map';

describe('defineColadaStructureAccessorsConfigMap', () => {
  it('is a function', () => {
    expect(typeof defineColadaStructureAccessorsConfigMap).toBe('function');
  });

  it('returns config with get, getByIndex, orderedKeys, size', () => {
    const config = defineColadaStructureAccessorsConfigMap(
      { id: StructureAccessorPresets.structureName },
      { state: { type: 'object', vue: 'reactive' } }
    );
    expect(config).toHaveProperty('get');
    expect(config).toHaveProperty('getByIndex');
    expect(config).toHaveProperty('orderedKeys');
    expect(config).toHaveProperty('size');
    expect(config.size).toBe(2);
  });

  it('preserves order of entries in orderedKeys', () => {
    const config = defineColadaStructureAccessorsConfigMap(
      { id: StructureAccessorPresets.structureName },
      { deps: StructureAccessorPresets.objectWritable },
      { state: { type: 'object', vue: 'reactive' } }
    );
    expect(config.orderedKeys).toEqual(['id', 'deps', 'state']);
  });

  it('lookup by key returns normalized accessor descriptor', () => {
    const config = defineColadaStructureAccessorsConfigMap(
      { id: StructureAccessorPresets.structureName },
      { state: { type: 'object', vue: 'reactive' } }
    );
    expect(config.get('id')).toEqual({ type: 'string' });
    const stateDesc = config.get('state') as { type: string; vue: string };
    expect(stateDesc?.type).toBe('object');
    expect(stateDesc?.vue).toBe('reactive');
    expect(config.get('missing')).toBeUndefined();
  });

  it('getByIndex returns [key, descriptor] in order', () => {
    const config = defineColadaStructureAccessorsConfigMap(
      { id: StructureAccessorPresets.structureName },
      { state: { type: 'object', vue: 'reactive' } }
    );
    expect(config.getByIndex(0)).toEqual(['id', { type: 'string' }]);
    const at1 = config.getByIndex(1);
    expect(at1?.[0]).toBe('state');
    expect((at1?.[1] as { type: string; vue: string })?.type).toBe('object');
    expect((at1?.[1] as { type: string; vue: string })?.vue).toBe('reactive');
    expect(config.getByIndex(2)).toBeUndefined();
    expect(config.getByIndex(-1)).toBeUndefined();
  });

  it('throws if entry has more than one key', () => {
    expect(() =>
      defineColadaStructureAccessorsConfigMap({
        id: StructureAccessorPresets.structureName,
        extra: { type: 'object', vue: 'reactive' },
      } as { id: StructureAccessorAllUnion; extra: StructureAccessorAllUnion })
    ).toThrow(/exactly one key/);
  });

  it('throws if entry has zero keys', () => {
    expect(() =>
      defineColadaStructureAccessorsConfigMap({} as Record<string, StructureAccessorAllUnion>)
    ).toThrow(/exactly one key/);
  });
});
