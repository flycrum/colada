/**
 * OmitStrict<Type, Union> constructs a type by omitting from Type all union members that are assignable to Union.
 * The built-in Omit<Type, Keys> does not enforce that Keys are in Type; OmitStrict restricts Keys to keyof Type.
 *
 * @example ```ts
 * type Data = {'blue': '#0000ff', 'red': '#ff0000', 'short': '10px', 'tall': '40px'};
 * type Colors = OmitStrict<Data, 'short' | 'tall'>; // { blue: '#0000ff'; red: '#ff0000'; }
 * type Heights = OmitStrict<Data, 'blue' | 'red'>; // { short: '10px'; tall: '40px'; }
 * type More = OmitStrict<Data, 'Hello'>; // type error ('Hello' not in union)
 * ```
 */
export type OmitStrict<ObjectType, KeysType extends keyof ObjectType> = Pick<
  ObjectType,
  Exclude<keyof ObjectType, KeysType>
>;
