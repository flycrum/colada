import { describe, expect, it } from 'vitest';
import {
  normalizeStructureAccessor,
  StructureAccessorPresets,
} from './define-colada-structure-accessor-presets';
import type { StructureAccessorAllUnion } from './define-colada-structure-accessor-types';

describe('normalizeStructureAccessor', () => {
  it('returns full descriptor for preset object reactive', () => {
    const out = normalizeStructureAccessor({ type: 'object', vue: 'reactive' });
    expect(out).toEqual({
      type: 'object',
      visibility: 'public',
      access: 'readonly',
      mutability: 'immutable',
      vue: 'reactive',
    });
  });

  it('returns full descriptor for preset object computed', () => {
    const out = normalizeStructureAccessor({ type: 'object', vue: 'computed' });
    expect(out).toEqual({
      type: 'object',
      visibility: 'public',
      access: 'readonly',
      mutability: 'immutable',
      vue: 'computed',
    });
  });

  it('returns full descriptor for preset function (default public)', () => {
    const out = normalizeStructureAccessor({ type: 'function' });
    expect(out).toEqual({ type: 'function', visibility: 'public' });
  });

  it('returns full descriptor for preset function private', () => {
    const out = normalizeStructureAccessor({ type: 'function', visibility: 'private' });
    expect(out).toEqual({ type: 'function', visibility: 'private' });
  });

  it('returns full descriptor for string, constructor, hooks', () => {
    expect(normalizeStructureAccessor({ type: 'string' })).toEqual({ type: 'string' });
    expect(normalizeStructureAccessor({ type: 'constructor' })).toEqual({ type: 'constructor' });
    expect(normalizeStructureAccessor({ type: 'hooks' })).toEqual({ type: 'hooks' });
  });

  it('returns full descriptor when given full preset const', () => {
    const out = normalizeStructureAccessor(StructureAccessorPresets.stateReactiveReadonly);
    expect(out).toEqual(StructureAccessorPresets.stateReactiveReadonly);
  });

  it('throws for non-object input', () => {
    expect(() => normalizeStructureAccessor(null as unknown as StructureAccessorAllUnion)).toThrow(
      /must be an object/
    );
  });
});

describe('StructureAccessorPresets', () => {
  it('exposes stateReactiveReadonly with expected shape', () => {
    expect(StructureAccessorPresets.stateReactiveReadonly).toMatchObject({
      type: 'object',
      visibility: 'public',
      access: 'readonly',
      mutability: 'immutable',
      vue: 'reactive',
    });
  });

  it('exposes gettersComputed with expected shape', () => {
    expect(StructureAccessorPresets.gettersComputed).toMatchObject({
      type: 'object',
      vue: 'computed',
      access: 'readonly',
    });
  });

  it('exposes methodsPublic and methodsPrivate', () => {
    expect(StructureAccessorPresets.methodsPublic).toEqual({
      type: 'function',
      visibility: 'public',
    });
    expect(StructureAccessorPresets.methodsPrivate).toEqual({
      type: 'function',
      visibility: 'private',
    });
  });

  it('exposes structureName, constructor, hooks', () => {
    expect(StructureAccessorPresets.structureName).toEqual({ type: 'string' });
    expect(StructureAccessorPresets.constructor).toEqual({ type: 'constructor' });
    expect(StructureAccessorPresets.hooks).toEqual({ type: 'hooks' });
  });
});
