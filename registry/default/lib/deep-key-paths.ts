/**
 * Credit: https://stackoverflow.com/questions/77976781/typescript-type-for-getting-all-nested-key-paths-of-an-object-including-arrays
 */

/**
 * A utility type that extracts all nested key paths from an object type as a union of string literals.
 *
 * Unlike TypeScript's built-in `keyof` which only provides top-level keys, `DeepKeyPaths<T>`
 * recursively traverses the object structure to generate all possible key paths, including:
 * - Nested object properties (e.g., `"address.street"`)
 * - Array indices using both dot notation and bracket notation (e.g., `"hobbies.0"` and `"hobbies[0]"`)
 * - Deeply nested paths (e.g., `"hobbies[0].name"`)
 *
 * The type intelligently handles arrays by excluding array methods (like `push`, `pop`, `map`, etc.)
 * and only including numeric indices for array access.
 *
 * @template T - The object type to extract key paths from
 *
 * @example
 * ```typescript
 * interface Person {
 *   name: string;
 *   address: {
 *     street: string;
 *     city: string;
 *     state: string;
 *   };
 *   hobbies: Array<{
 *     name: string;
 *   }>;
 * }
 *
 * type PersonPaths = DeepKeyPaths<Person>;
 * // Result:
 * // | "name"
 * // | "address"
 * // | "address.street"
 * // | "address.city"
 * // | "address.state"
 * // | "hobbies"
 * // | `hobbies.${number}`
 * // | `hobbies[${number}]`
 * // | `hobbies.${number}.name`
 * // | `hobbies[${number}].name`
 * ```
 *
 * @example
 * ```typescript
 * interface Config {
 *   api: {
 *     baseUrl: string;
 *     timeout: number;
 *   };
 *   features: string[];
 * }
 *
 * type ConfigPaths = DeepKeyPaths<Config>;
 * // Result:
 * // | "api"
 * // | "api.baseUrl"
 * // | "api.timeout"
 * // | "features"
 * // | `features.${number}`
 * // | `features[${number}]`
 * ```
 *
 * @remarks
 * This type uses several helper types:
 * - `FixArr<T>`: Removes array methods from array types, keeping only numeric indices
 * - `DeepKeys<T>`: Recursively generates key paths with dot prefixes
 * - `DropInitDot<T>`: Removes the leading dot from generated paths
 *
 * The type handles:
 * - Objects: Recursively extracts all property paths
 * - Arrays: Generates both dot notation (`array.0`) and bracket notation (`array[0]`) for indices
 * - Nested structures: Traverses deeply nested objects and arrays
 * - Primitives: Returns `never` for non-object types
 */
type FixArr<T> = T extends readonly unknown[]
  ? Omit<T, Exclude<keyof unknown[], number>>
  : T;

type DeepKeys<T> = T extends object
  ? {
      [K in (string | number) & keyof T]: `${
        | `.${K}`
        | (`${K}` extends `${number}`
            ? `[${K}]`
            : never)}${"" | DeepKeys<FixArr<T[K]>>}`;
    }[(string | number) & keyof T]
  : never;

type DropInitDot<T> = T extends `.${infer U}` ? U : T;

export type DeepKeyPaths<T> = DropInitDot<DeepKeys<FixArr<T>>>;
