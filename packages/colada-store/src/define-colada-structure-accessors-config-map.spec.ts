import { describe, expect, it } from 'vitest';
import {
  defineColadaStructureAccessorsConfigMap,
  StructureAccessorTypes,
  type StructureAccessorType,
} from './define-colada-structure-accessors-config-map';

describe('defineColadaStructureAccessorsConfigMap', () => {
  it('is a function', () => {
    expect(typeof defineColadaStructureAccessorsConfigMap).toBe('function');
  });

  it('returns config with get, getByIndex, orderedKeys, size', () => {
    const config = defineColadaStructureAccessorsConfigMap(
      { id: StructureAccessorTypes.STRUCTURE_NAME },
      { state: StructureAccessorTypes.OBJECT_REACTIVE_READONLY }
    );
    expect(config).toHaveProperty('get');
    expect(config).toHaveProperty('getByIndex');
    expect(config).toHaveProperty('orderedKeys');
    expect(config).toHaveProperty('size');
    expect(config.size).toBe(2);
  });

  it('preserves order of entries in orderedKeys', () => {
    const config = defineColadaStructureAccessorsConfigMap(
      { id: StructureAccessorTypes.STRUCTURE_NAME },
      { deps: StructureAccessorTypes.OBJECT },
      { state: StructureAccessorTypes.OBJECT_REACTIVE_READONLY }
    );
    expect(config.orderedKeys).toEqual(['id', 'deps', 'state']);
  });

  it('lookup by key returns type', () => {
    const config = defineColadaStructureAccessorsConfigMap(
      { id: StructureAccessorTypes.STRUCTURE_NAME },
      { state: StructureAccessorTypes.OBJECT }
    );
    expect(config.get('id')).toBe('structure_name');
    expect(config.get('state')).toBe('object');
    expect(config.get('missing')).toBeUndefined();
  });

  it('getByIndex returns [key, type] in order', () => {
    const config = defineColadaStructureAccessorsConfigMap(
      { id: StructureAccessorTypes.STRUCTURE_NAME },
      { state: StructureAccessorTypes.OBJECT }
    );
    expect(config.getByIndex(0)).toEqual(['id', 'structure_name']);
    expect(config.getByIndex(1)).toEqual(['state', 'object']);
    expect(config.getByIndex(2)).toBeUndefined();
    expect(config.getByIndex(-1)).toBeUndefined();
  });

  it('throws if entry has more than one key', () => {
    expect(() =>
      defineColadaStructureAccessorsConfigMap({
        id: 'structure_name' as StructureAccessorType,
        extra: 'object' as StructureAccessorType,
      })
    ).toThrow(/exactly one key/);
  });

  it('throws if entry has zero keys', () => {
    expect(() =>
      defineColadaStructureAccessorsConfigMap({} as Record<string, StructureAccessorType>)
    ).toThrow(/exactly one key/);
  });
});
