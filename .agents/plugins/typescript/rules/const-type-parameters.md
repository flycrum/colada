# Const type parameters

- Use `const` on generic type params when inferring narrow literal types from consumer args (e.g. `const TEntries extends readonly StructureAccessorConfigEntry[]`)
- Prefer over requiring consumer `as const`; library enforces narrowing so consumers write normal literals
