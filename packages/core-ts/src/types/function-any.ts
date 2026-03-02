/**
 * A generic function type that accepts any number of arguments and returns a value.
 *
 * @typeParam TReturn The return type of the function. Defaults to `any` if not specified.
 *
 * @example ```ts
 * type FnAny = FunctionAny; // (...args: any[]) => any
 * type NumFn = FunctionAny<number>; // (...args: any[]) => number
 * type VoidFn = FunctionAny<void>; // (...args: any[]) => void
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionAny<TReturn = any> = (...args: any[]) => TReturn;
