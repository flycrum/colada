/**
 * defineColadaStructureAccessorsConfigMap – builds ordered, typed Structure Accessors config.
 * See [define-colada-structure-accessors-config-map.agents.md](./define-colada-structure-accessors-config-map.agents.md).
 */

import type { StructureAccessorInput } from './define-colada-structure-accessor-presets';
import { normalizeStructureAccessor } from './define-colada-structure-accessor-presets';
import type { StructureAccessorAllUnion } from './define-colada-structure-accessor-types';

/** Single entry: one accessor name → one accessor input (preset or full descriptor). */
export type StructureAccessorConfigEntry = Record<string, StructureAccessorInput>;

type SingleEntry = StructureAccessorConfigEntry;

/** Extract ordered keys tuple from tuple of single-key entries. */
export type OrderedKeysFromEntries<T extends readonly StructureAccessorConfigEntry[]> = {
  [I in keyof T]: keyof T[I] & string;
};

type OrderedKeys<T extends readonly SingleEntry[]> = OrderedKeysFromEntries<T>;

/** Config shape: map + ordered keys for key and index lookup. */
export interface StructureAccessorsConfigShape<
  TOrderedKeys extends readonly string[] = readonly string[],
> {
  get(key: string): StructureAccessorAllUnion | undefined;
  getByIndex(index: number): [key: string, type: StructureAccessorAllUnion] | undefined;
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
 * Entry values are normalized (presets expanded to full descriptors). Order is preserved.
 */
export function defineColadaStructureAccessorsConfigMap<const T extends readonly SingleEntry[]>(
  ...entries: T
): StructureAccessorsConfigShape<OrderedKeys<T>> {
  const orderedKeys: string[] = [];
  const map = new Map<string, StructureAccessorAllUnion>();
  for (const entry of entries) {
    const key = extractSingleKey(entry);
    orderedKeys.push(key);
    const value = entry[key] as StructureAccessorInput;
    map.set(key, normalizeStructureAccessor(value));
  }
  Object.freeze(orderedKeys);
  return {
    get(key: string) {
      return map.get(key);
    },
    getByIndex(index: number): [key: string, type: StructureAccessorAllUnion] | undefined {
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
