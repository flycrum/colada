/**
 * Type tests for FunctionAny.
 */

import { describe, expectTypeOf, test } from 'vitest';
import type { FunctionAny } from './function-any';

test('FunctionAny default is (...args: any[]) => any', () => {
  expectTypeOf<FunctionAny>().returns.toBeAny();
});

test('FunctionAny<number> returns number', () => {
  expectTypeOf<FunctionAny<number>>().returns.toEqualTypeOf<number>();
});

test('FunctionAny<string> returns string', () => {
  expectTypeOf<FunctionAny<string>>().returns.toEqualTypeOf<string>();
});

test('FunctionAny<void> returns void', () => {
  expectTypeOf<FunctionAny<void>>().returns.toBeVoid();
});

describe('negative cases: wrong return type produces type error', () => {
  test('function returning string not assignable to FunctionAny<number>', () => {
    // @ts-expect-error - return type string not assignable to number
    const fn: FunctionAny<number> = () => 'hello';
    void fn;
  });

  test('function returning number not assignable to FunctionAny<string>', () => {
    // @ts-expect-error - return type number not assignable to string
    const fn: FunctionAny<string> = () => 42;
    void fn;
  });
});
