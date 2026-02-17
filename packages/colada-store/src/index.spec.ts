import { describe, expect, it } from 'vitest';
import { defineColadaStore } from './index';

describe('colada-store', () => {
  it('exports defineColadaStore', () => {
    expect(typeof defineColadaStore).toBe('function');
  });
});
