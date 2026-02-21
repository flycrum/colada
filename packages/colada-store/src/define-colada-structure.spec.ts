import { describe, expect, it } from 'vitest';
import {
  BASE_PROPS,
  defineColadaStructure,
  type BaseProp,
  type ColadaStructureInterfaceConfig,
} from './define-colada-structure';

describe('defineColadaStructure', () => {
  it('is a function', () => {
    expect(typeof defineColadaStructure).toBe('function');
  });

  it('exports BASE_PROPS with expected base property names', () => {
    const expected: BaseProp[] = [
      'key',
      'deps',
      'constants',
      'state',
      'getters',
      'helpers',
      'actions',
      'hooks',
      'constructor',
    ];
    expect(BASE_PROPS).toEqual(expected);
  });

  it('returns a factory that accepts a definition and returns useComposable', () => {
    const config: ColadaStructureInterfaceConfig = {
      key: 'id',
      deps: 'deps',
      state: 'state',
      getters: 'getters',
      helpers: 'helpers',
      actions: 'actions',
      hooks: 'hooks',
      constants: 'constants',
      constructor: false,
    };
    const create = defineColadaStructure(config);
    const result = create(() => ({
      id: 'test',
      deps: () => ({}),
      constants: () => ({}),
      state: () => ({}),
      getters: () => ({}),
      helpers: () => ({}),
      actions: () => ({}),
      hooks: () => ({}),
    }));
    expect(result).toHaveProperty('useComposable');
    expect(typeof result.useComposable).toBe('function');
    const instance = result.useComposable();
    expect(instance).toBeDefined();
    expect(instance.id).toBe('test');
  });

  it('remaps public names to base names via Proxy', () => {
    const config = { key: 'id' } as ColadaStructureInterfaceConfig;
    const create = defineColadaStructure(config);
    const result = create(() => ({ id: 'my-id' }));
    const instance = result.useComposable();
    expect(instance.id).toBe('my-id');
  });

  it('excludes disabled props from mapping', () => {
    const config = {
      key: 'id',
      deps: false,
      constants: false,
      state: 'state',
      getters: false,
      helpers: false,
      actions: false,
      hooks: false,
      constructor: false as const,
    } satisfies ColadaStructureInterfaceConfig;
    const create = defineColadaStructure(config);
    const result = create(() => ({ id: 'x', state: () => ({ count: 0 }) }));
    const instance = result.useComposable();
    expect(instance.id).toBe('x');
    expect(instance.state).toBeDefined();
  });
});
