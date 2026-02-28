/**
 * Structure accessor presets and normalize helper – default combinations and runtime resolution.
 * See [define-colada-structure-accessor-types.agents.md](./define-colada-structure-accessor-types.agents.md).
 */

import type {
  StructureAccessorAllUnion,
  StructureAccessorConstructor,
  StructureAccessorFunction,
  StructureAccessorHooks,
  StructureAccessorObjectReadonly,
  StructureAccessorObjectReadonlyVueComputed,
  StructureAccessorObjectReadonlyVueReactive,
  StructureAccessorObjectWritable,
  StructureAccessorObjectWritableVueReactive,
  StructureAccessorString,
} from './define-colada-structure-accessor-types';

/** Preset input: object reactive (e.g. state). Defaults: public, readonly, immutable. */
export interface StructureAccessorPresetObjectReactive {
  type: 'object';
  vue: 'reactive';
}

/** Preset input: object computed (e.g. getters). Defaults: public, readonly, immutable. */
export interface StructureAccessorPresetObjectComputed {
  type: 'object';
  vue: 'computed';
}

/** Preset input: function. Default visibility 'public'. */
export interface StructureAccessorPresetFunction {
  type: 'function';
  visibility?: 'public' | 'private';
}

/** Preset input: string (e.g. structure name). */
export interface StructureAccessorPresetString {
  type: 'string';
}

/** Preset input: constructor. */
export interface StructureAccessorPresetConstructor {
  type: 'constructor';
}

/** Preset input: hooks. */
export interface StructureAccessorPresetHooks {
  type: 'hooks';
}

/** Preset input: object readonly, no Vue. Defaults: public, immutable. */
export interface StructureAccessorPresetObjectReadonly {
  type: 'object';
  access: 'readonly';
  vue?: false;
  visibility?: 'public' | 'private';
}

/** Preset input: object writable. Defaults: public, mutable, vue false or 'reactive'. */
export interface StructureAccessorPresetObjectWritable {
  type: 'object';
  access: 'writable';
  vue?: false | 'reactive';
  visibility?: 'public' | 'private';
  mutability?: 'immutable' | 'mutable';
}

/** Union of preset inputs; partial shapes that normalize to full descriptors. */
export type StructureAccessorPresetInput =
  | StructureAccessorPresetObjectReactive
  | StructureAccessorPresetObjectComputed
  | StructureAccessorPresetFunction
  | StructureAccessorPresetString
  | StructureAccessorPresetConstructor
  | StructureAccessorPresetHooks
  | StructureAccessorPresetObjectReadonly
  | StructureAccessorPresetObjectWritable;

/** Input is either a preset (partial) or a full accessor descriptor. */
export type StructureAccessorInput = StructureAccessorPresetInput | StructureAccessorAllUnion;

/** Full descriptors for common accessor combinations (runtime presets). */
export const StructureAccessorPresets = {
  /** State: readonly, public, immutable, Vue reactive. */
  stateReactiveReadonly: {
    type: 'object',
    visibility: 'public' as const,
    access: 'readonly' as const,
    mutability: 'immutable' as const,
    vue: 'reactive' as const,
  } satisfies StructureAccessorObjectReadonlyVueReactive,

  /** Getters: readonly, public, immutable, Vue computed. */
  gettersComputed: {
    type: 'object',
    visibility: 'public' as const,
    access: 'readonly' as const,
    mutability: 'immutable' as const,
    vue: 'computed' as const,
  } satisfies StructureAccessorObjectReadonlyVueComputed,

  /** Methods: function, public. */
  methodsPublic: {
    type: 'function',
    visibility: 'public' as const,
  } satisfies StructureAccessorFunction,

  /** Methods internal/helpers: function, private. */
  methodsPrivate: {
    type: 'function',
    visibility: 'private' as const,
  } satisfies StructureAccessorFunction,

  /** Structure name: string. */
  structureName: {
    type: 'string',
  } satisfies StructureAccessorString,

  /** Constructor. */
  constructor: {
    type: 'constructor',
  } satisfies StructureAccessorConstructor,

  /** Hooks. */
  hooks: {
    type: 'hooks',
  } satisfies StructureAccessorHooks,

  /** Object readonly, no Vue. Public, immutable. */
  objectReadonly: {
    type: 'object',
    visibility: 'public' as const,
    access: 'readonly' as const,
    mutability: 'immutable' as const,
    vue: false as const,
  } satisfies StructureAccessorObjectReadonly,

  /** Object writable, no Vue. Public, mutable. */
  objectWritable: {
    type: 'object',
    visibility: 'public' as const,
    access: 'writable' as const,
    mutability: 'mutable' as const,
    vue: false as const,
  } satisfies StructureAccessorObjectWritable,

  /** Object writable, Vue reactive. */
  objectWritableReactive: {
    type: 'object',
    visibility: 'public' as const,
    access: 'writable' as const,
    mutability: 'mutable' as const,
    vue: 'reactive' as const,
  } satisfies StructureAccessorObjectWritableVueReactive,
} as const;

/** Default options when not specified: public visibility, readonly → immutable, etc. */
const DEFAULTS = {
  visibility: 'public' as const,
  access: 'readonly' as const,
  mutability: 'immutable' as const,
  vue: false as const,
};

/**
 * Normalizes a preset input or full accessor to a full StructureAccessorAllUnion.
 * Preset inputs are expanded with defaults; full descriptors are returned as-is.
 */
export function normalizeStructureAccessor(
  input: StructureAccessorInput
): StructureAccessorAllUnion {
  if (typeof input !== 'object' || input === null) {
    throw new Error('StructureAccessorInput must be an object');
  }
  const t = (input as { type: string }).type;
  switch (t) {
    case 'object': {
      type ObjectInput = {
        type: 'object';
        vue?: 'reactive' | 'computed' | false;
        access?: 'readonly' | 'writable';
        visibility?: 'public' | 'private';
        mutability?: 'immutable' | 'mutable';
      };
      const o = input as ObjectInput;
      if (o.vue === 'reactive') {
        return {
          type: 'object',
          visibility: (o.visibility ?? DEFAULTS.visibility) as 'public' | 'private',
          access: 'readonly',
          mutability: 'immutable',
          vue: 'reactive',
        };
      }
      if (o.vue === 'computed') {
        return {
          type: 'object',
          visibility: (o.visibility ?? DEFAULTS.visibility) as 'public' | 'private',
          access: 'readonly',
          mutability: 'immutable',
          vue: 'computed',
        };
      }
      if (o.access === 'writable') {
        return {
          type: 'object',
          visibility: (o.visibility ?? DEFAULTS.visibility) as 'public' | 'private',
          access: 'writable',
          mutability: (o.mutability ?? 'mutable') as 'immutable' | 'mutable',
          vue: (o.vue ?? false) as false | 'reactive',
        };
      }
      return {
        type: 'object',
        visibility: (o.visibility ?? DEFAULTS.visibility) as 'public' | 'private',
        access: 'readonly',
        mutability: 'immutable',
        vue: (o.vue ?? false) as false | 'computed',
      };
    }
    case 'function': {
      const f = input as StructureAccessorPresetFunction;
      return {
        type: 'function',
        visibility: f.visibility ?? DEFAULTS.visibility,
      };
    }
    case 'string':
      return { type: 'string' };
    case 'constructor':
      return { type: 'constructor' };
    case 'hooks':
      return { type: 'hooks' };
    default:
      return input as StructureAccessorAllUnion;
  }
}
