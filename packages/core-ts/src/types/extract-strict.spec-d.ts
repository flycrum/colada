/**
 * Type tests for ExtractStrict.
 */

import { describe, expectTypeOf, test } from 'vitest';
import type { ExtractStrict } from './extract-strict';

test('ExtractStrict extracts assignable union members', () => {
  type Num = '1' | '2' | '3' | '4';
  type Evens = ExtractStrict<Num, '2' | '4'>;
  expectTypeOf<Evens>().toEqualTypeOf<'2' | '4'>();
});

test('ExtractStrict single member', () => {
  type Num = '1' | '2' | '3';
  type Two = ExtractStrict<Num, '2'>;
  expectTypeOf<Two>().toEqualTypeOf<'2'>();
});

test('ExtractStrict full union returns same', () => {
  type Num = '1' | '2';
  type All = ExtractStrict<Num, '1' | '2'>;
  expectTypeOf<All>().toEqualTypeOf<'1' | '2'>();
});

describe('negative cases: invalid Union produces type error', () => {
  test('Union member not in Type errors', () => {
    type Num = '1' | '2' | '3';
    // @ts-expect-error - '99' is not in union Num
    type _Bad = ExtractStrict<Num, '99'>;
  });

  test('Union with extra literal not in Type errors', () => {
    type Num = '1' | '2';
    // @ts-expect-error - '3' is not in union Num
    type _Bad = ExtractStrict<Num, '1' | '3'>;
  });
});
