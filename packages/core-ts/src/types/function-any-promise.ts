/**
 * A generic async function type that accepts any number of arguments and returns a Promise.
 *
 * @typeParam TReturn The resolved type of the Promise. Defaults to `any` if not specified.
 *
 * @example ```ts
 * type AsyncFnAny = FunctionAnyPromise; // (...args: any[]) => Promise<any>
 * type AsyncStrFn = FunctionAnyPromise<string>; // (...args: any[]) => Promise<string>
 * type AsyncVoidFn = FunctionAnyPromise<void>; // (...args: any[]) => Promise<void>
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionAnyPromise<TReturn = any> = (...args: any[]) => Promise<TReturn>;
