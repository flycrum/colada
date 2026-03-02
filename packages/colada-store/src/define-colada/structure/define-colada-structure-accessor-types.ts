/**
 * Structure accessor type definitions – discriminated unions for accessor behavior and typings.
 * See [define-colada-structure-accessor-types.agents.md](./define-colada-structure-accessor-types.agents.md).
 */

export interface StructureAccessorBase {
  /** The type of the accessor which determines the functionality of it within the generated structure. */
  type: 'constructor' | 'function' | 'hooks' | 'object' | 'string';
}

export interface StructureAccessorObjectBase extends StructureAccessorBase {
  type: 'object';
  /** Visibility: 'private' = not exposed to public API, 'public' = exposed. */
  visibility: 'private' | 'public';
  /** Access: 'readonly' = const-like, 'writable' = may be mutated. */
  access: 'readonly' | 'writable';
  /** Mutability: 'immutable' = only internal mutation, 'mutable' = externally mutable. */
  mutability: 'immutable' | 'mutable';
  /** Whether the object uses Vue's computed system (e.g. computed). */
  vue: false | 'reactive' | 'computed';
}

/** Readonly object accessor: const-like; reactive/mutability are irrelevant. */
export interface StructureAccessorObjectReadonly extends StructureAccessorObjectBase {
  type: 'object';
  visibility: 'private' | 'public';
  access: 'readonly';
  mutability: 'immutable';
  vue: false | 'computed';
}

/** Readonly object with Vue computed (e.g. getters). */
export interface StructureAccessorObjectReadonlyVueComputed extends StructureAccessorObjectBase {
  type: 'object';
  visibility: 'private' | 'public';
  access: 'readonly';
  mutability: 'immutable';
  vue: 'computed';
}

/** Readonly object with Vue reactive (e.g. state). */
export interface StructureAccessorObjectReadonlyVueReactive extends StructureAccessorObjectBase {
  type: 'object';
  visibility: 'private' | 'public';
  access: 'readonly';
  mutability: 'immutable';
  vue: 'reactive';
}

/** Mutable object accessor: may be reactive and/or immutable. */
export interface StructureAccessorObjectWritable extends StructureAccessorObjectBase {
  type: 'object';
  visibility: 'private' | 'public';
  access: 'writable';
  mutability: 'immutable' | 'mutable';
  vue: false | 'reactive';
}

/** Mutable object accessor with Vue reactive; reserved for future typing. */
export interface StructureAccessorObjectWritableVueReactive extends StructureAccessorObjectWritable {
  type: 'object';
  visibility: 'private' | 'public';
  access: 'writable';
  mutability: 'immutable' | 'mutable';
  vue: 'reactive';
}

/** Discriminated union: readonly (const-like) vs mutable (reactive/immutable). */
export type StructureAccessorObjects =
  | StructureAccessorObjectReadonly
  | StructureAccessorObjectReadonlyVueComputed
  | StructureAccessorObjectReadonlyVueReactive
  | StructureAccessorObjectWritable
  | StructureAccessorObjectWritableVueReactive;

export interface StructureAccessorString {
  type: 'string';
}

export interface StructureAccessorConstructor {
  type: 'constructor';
}

export interface StructureAccessorFunction {
  type: 'function';
  /** Visibility: 'private' = not exposed to public API, 'public' = exposed. */
  visibility: 'private' | 'public';
}

export interface StructureAccessorHooks {
  type: 'hooks';
}

export type StructureAccessorAllUnion =
  | StructureAccessorObjects
  | StructureAccessorString
  | StructureAccessorConstructor
  | StructureAccessorFunction
  | StructureAccessorHooks;
