/**
 * defineColadaStructure – core abstraction layer for colada interfaces.
 * Typing and property mapping only; no store/state behavior in this layer.
 * See [define-colada-structure.reqs.md](./define-colada-structure.reqs.md).
 */

/** Base property names. Interfaces rename, disable, or wrap these. */
export const BASE_PROPS = [
  'key',
  'deps',
  'constants',
  'state',
  'getters',
  'helpers',
  'actions',
  'hooks',
  'constructor',
] as const;

export type BaseProp = (typeof BASE_PROPS)[number];

/**
 * Mapping for a single base property.
 * - string: expose under this name (rename).
 * - false: disable; exclude from interface and typings.
 * - Wrapper: extend/type the prop (e.g. constructor args); reserved for future use.
 */
export type PropertyMapping = string | false | { wrap: (value: unknown) => unknown };

/**
 * Interface config: for each base prop, specify rename (string), disable (false), or wrap.
 * Constructor: false => composable takes no args; wrap => typed init props.
 */
export type ColadaStructureInterfaceConfig = {
  [K in BaseProp]?: PropertyMapping;
};

/**
 * Creates the structure layer. Config drives typings and runtime remapping.
 * Returns a function that accepts the definition factory and returns the composable(s).
 * Skeleton: no reactivity, getters, actions, or lifecycle; Proxy remaps keys only.
 */
export function defineColadaStructure<
  const TInterfaceConfig extends ColadaStructureInterfaceConfig,
>(
  _interfaceConfig: TInterfaceConfig
): <TDefinition extends Record<string, unknown>>(
  definitionFactory: () => TDefinition
) => { useComposable: (initProps?: unknown) => RemappedDefinition } {
  return function createStructure<TDefinition extends Record<string, unknown>>(
    definitionFactory: () => TDefinition
  ) {
    const definition = definitionFactory();
    const config = _interfaceConfig as Record<BaseProp, string | false | undefined>;
    const publicToBase = new Map<string, BaseProp>();
    const internal: Record<string, unknown> = {};
    for (const base of BASE_PROPS) {
      const mapping = config[base];
      if (typeof mapping === 'string') {
        publicToBase.set(mapping, base);
        if (mapping in definition) internal[base] = definition[mapping];
      }
    }
    const remapped = new Proxy(internal as RemappedDefinition, {
      get(target, prop: string) {
        const base = publicToBase.get(prop);
        const key = base ?? prop;
        return (target as Record<string, unknown>)[key];
      },
      set(target, prop: string, value: unknown) {
        const base = publicToBase.get(prop);
        const key = base ?? prop;
        (target as Record<string, unknown>)[key] = value;
        return true;
      },
    });
    return {
      useComposable(initProps?: unknown) {
        if (initProps !== undefined) {
          // Reserved: constructor/init props applied here in full implementation.
        }
        return remapped;
      },
    };
  };
}

/** Instance shape after remapping; typed as generic for skeleton. */
export type RemappedDefinition = Record<string, unknown>;
