/**
 * defineColadaStructureAccessorsConfigMap – builds ordered, typed Structure Accessors config.
 * See [define-colada-structure-accessors-config-map.reqs.md](./define-colada-structure-accessors-config-map.reqs.md).
 */

/** Placeholder: concrete types and custom accessors are a follow-up. */
export type StructureAccessorType = string;

/** Stub constants for config map; concrete behavior per type is a follow-up. */
export const StructureAccessorTypes = {
  STRUCTURE_NAME: 'structure_name' as StructureAccessorType,
  OBJECT: 'object' as StructureAccessorType,
  OBJECT_READONLY: 'object_readonly' as StructureAccessorType,
  OBJECT_REACTIVE_READONLY: 'object_reactive_readonly' as StructureAccessorType,
  OBJECT_COMPUTED: 'object_computed' as StructureAccessorType,
  METHODS_INTERNAL: 'methods_internal' as StructureAccessorType,
  METHODS: 'methods' as StructureAccessorType,
  HOOKS: 'hooks' as StructureAccessorType,
  CONSTRUCTOR: 'constructor' as StructureAccessorType,
} as const;

/** Single entry: one accessor name → one type. */
type SingleEntry = Record<string, StructureAccessorType>;

/** Extract ordered keys from tuple of single-key entries. */
type OrderedKeys<T extends readonly SingleEntry[]> = {
  [I in keyof T]: keyof T[I] & string;
};

/** Config shape: map + ordered keys for key and index lookup. */
export interface StructureAccessorsConfigShape<
  TOrderedKeys extends readonly string[] = readonly string[],
> {
  get(key: string): StructureAccessorType | undefined;
  getByIndex(index: number): [key: string, type: StructureAccessorType] | undefined;
  orderedKeys: TOrderedKeys;
  size: number;
}

function extractSingleKey(entry: SingleEntry): string {
  const keys = Object.keys(entry);
  if (keys.length !== 1) throw new Error('Each config entry must have exactly one key');
  return keys[0]!;
}

/**
 * Builds ordered Structure Accessors config from single-key entries.
 * Order is preserved; lookup by key and by index.
 */
export function defineColadaStructureAccessorsConfigMap<const T extends readonly SingleEntry[]>(
  ...entries: T
): StructureAccessorsConfigShape<OrderedKeys<T>> {
  const orderedKeys: string[] = [];
  const map = new Map<string, StructureAccessorType>();
  for (const entry of entries) {
    const key = extractSingleKey(entry);
    orderedKeys.push(key);
    map.set(key, entry[key] as StructureAccessorType);
  }
  return {
    get(key: string) {
      return map.get(key);
    },
    getByIndex(index: number): [key: string, type: StructureAccessorType] | undefined {
      const key = orderedKeys[index];
      if (key === undefined) return undefined;
      const type = map.get(key);
      return type === undefined ? undefined : [key, type];
    },
    get orderedKeys() {
      return orderedKeys as OrderedKeys<T>;
    },
    get size() {
      return map.size;
    },
  };
}
