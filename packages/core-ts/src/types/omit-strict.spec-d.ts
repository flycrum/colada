/**
 * Type tests for OmitStrict.
 */

import { describe, expectTypeOf, test } from 'vitest';
import type { OmitStrict } from './omit-strict';

test('OmitStrict omits specified keys', () => {
  type Data = { blue: '#0000ff'; red: '#ff0000'; short: '10px'; tall: '40px' };
  type Colors = OmitStrict<Data, 'short' | 'tall'>;
  expectTypeOf<Colors>().toEqualTypeOf<{ blue: '#0000ff'; red: '#ff0000' }>();
});

test('OmitStrict single key', () => {
  type Data = { a: number; b: string };
  type NoA = OmitStrict<Data, 'a'>;
  expectTypeOf<NoA>().toEqualTypeOf<{ b: string }>();
});

test('OmitStrict all keys yields empty object', () => {
  type Data = { a: number };
  type None = OmitStrict<Data, 'a'>;
  expectTypeOf<None>().toEqualTypeOf<{}>();
});

describe('negative cases: Keys not in ObjectType produce type error', () => {
  test('key not in object errors', () => {
    type Data = { a: number; b: string };
    // @ts-expect-error - 'c' is not keyof Data
    type _Bad = OmitStrict<Data, 'c'>;
  });

  test('multiple keys with one invalid errors', () => {
    type Data = { a: number; b: string };
    // @ts-expect-error - 'z' is not keyof Data
    type _Bad = OmitStrict<Data, 'a' | 'z'>;
  });
});
