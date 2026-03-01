/**
 * Type tests for FunctionAnyPromise.
 */

import { describe, expectTypeOf, test } from 'vitest';
import type { FunctionAnyPromise } from './function-any-promise';

test('FunctionAnyPromise default returns Promise<any>', () => {
  expectTypeOf<FunctionAnyPromise>().returns.resolves.toBeAny();
});

test('FunctionAnyPromise<string> returns Promise<string>', () => {
  expectTypeOf<FunctionAnyPromise<string>>().returns.resolves.toBeString();
});

test('FunctionAnyPromise<void> returns Promise<void>', () => {
  expectTypeOf<FunctionAnyPromise<void>>().returns.resolves.toBeVoid();
});

describe('negative cases: wrong resolved type produces type error', () => {
  test('async function resolving string not assignable to FunctionAnyPromise<number>', () => {
    // @ts-expect-error - resolved type string not assignable to number
    const fn: FunctionAnyPromise<number> = async () => 'hello';
    void fn;
  });

  test('async function resolving number not assignable to FunctionAnyPromise<string>', () => {
    // @ts-expect-error - resolved type number not assignable to string
    const fn: FunctionAnyPromise<string> = async () => 42;
    void fn;
  });
});
