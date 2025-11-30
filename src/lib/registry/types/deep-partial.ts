/**
 * Credit: https://github.com/typeorm/typeorm/blob/master/src/common/DeepPartial.ts
 */

/**
 * A utility type that recursively makes all properties of a type optional, including nested objects.
 *
 * Unlike TypeScript's built-in `Partial<T>` which only makes top-level properties optional,
 * `DeepPartial<T>` recursively applies the `Partial` transformation to all nested objects,
 * arrays, Maps, and Sets within the type structure.
 *
 * @template T - The type to make deeply partial
 *
 * @example
 * ```typescript
 * interface User {
 *   id: number;
 *   name: string;
 *   address: {
 *     street: string;
 *     city: string;
 *   };
 * }
 *
 * type PartialUser = DeepPartial<User>;
 * // Result:
 * // {
 * //   id?: number;
 * //   name?: string;
 * //   address?: {
 * //     street?: string;
 * //     city?: string;
 * //   };
 * // }
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
 * const partialConfig: DeepPartial<Config> = {
 *   api: {
 *     baseUrl: "https://api.example.com"
 *     // timeout is optional
 *   }
 *   // features is optional
 * };
 * ```
 *
 * @remarks
 * This type handles:
 * - Objects: Recursively makes all properties optional
 * - Arrays: Makes array elements deeply partial
 * - Maps: Makes both keys and values deeply partial
 * - Sets: Makes set elements deeply partial
 * - Primitives: Returns as-is
 */
export type DeepPartial<T> =
  | T
  | (T extends Array<infer U>
      ? DeepPartial<U>[]
      : T extends Map<infer K, infer V>
        ? Map<DeepPartial<K>, DeepPartial<V>>
        : T extends Set<infer M>
          ? Set<DeepPartial<M>>
          : T extends object
            ? { [K in keyof T]?: DeepPartial<T[K]> }
            : T);
