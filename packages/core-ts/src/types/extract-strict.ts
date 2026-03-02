/**
 * ExtractStrict<Type, Union> constructs a type by extracting from Type all union members that are assignable to Union.
 * The built-in alternative Extract<Type, Union> does not throw error if trying to extract members not in the Type.
 *
 * @example ```ts
 * type Num = '1' | '2' | '3' | '4';
 * type Evens = ExtractStrict<Num, '2' | '4'>; // '2' | '4'
 * type Odds = ExtractStrict<Num, '1' | '3'>; // '1' | '3'
 * type More = ExtractStrict<Num, 'Hello'>; // type error ('Hello' not in union)
 * ```
 */
export type ExtractStrict<Type, Union extends Partial<Type>> = Extract<Type, Union>;
