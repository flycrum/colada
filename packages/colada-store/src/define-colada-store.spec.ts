import { describe, expect, it } from 'vitest';
import { defineColadaStore } from './define-colada-store';

describe('defineColadaStore', () => {
  it('is a function', () => {
    expect(typeof defineColadaStore).toBe('function');
  });
});
