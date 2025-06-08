/**
 * extractKeysFromObject
 * ---------------------
 * Extracts a new object by selecting only the specified keys from a source object.
 *
 * This utility is useful when you need to create a new object containing only a subset
 * of properties from a larger object—commonly used for sanitizing data, separating
 * payloads, or limiting exposed fields.
 *
 * @param source - The original object to extract properties from.
 * @param keys - An array of keys to pick from the source object.
 * @returns A new object containing only the specified keys from the source.
 *
 * @example
 * const user = { id: 1, name: 'Ali', email: 'a@example.com', role: 'admin' };
 * const publicUser = extractKeysFromObject(user, ['name', 'email']);
 */
export function extractKeysFromObject<T extends object, K extends keyof T>(
  source: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in source) {
      result[key] = source[key];
    }
  }
  return result;
}

/**
 * omitKeysFromObject
 * ------------------
 * Creates a shallow copy of an object, excluding the specified keys.
 *
 * This utility is useful when you want to remove sensitive or irrelevant fields
 * before passing data forward—for example, omitting internal IDs, passwords, or metadata
 * before sending to a client or another service.
 *
 * @param source - The original object to copy from.
 * @param keysToOmit - An array of keys to exclude from the returned object.
 * @returns A new object identical to the source but without the specified keys.
 *
 * @example
 * const user = { id: 1, name: 'Ali', email: 'a@example.com', password: 'secret' };
 * const safeUser = omitKeysFromObject(user, ['password']);
 * // safeUser: { id: 1, name: 'Ali', email: 'a@example.com' }
 */
export function omitKeysFromObject<T extends object, K extends keyof T>(
  source: T,
  keysToOmit: K[],
): Omit<T, K> {
  const result = {} as T;
  const omitKeysSet = new Set<K>(keysToOmit);
  for (const key of Object.keys(source) as K[]) {
    if (!omitKeysSet.has(key)) {
      result[key] = source[key];
    }
  }
  return result as Omit<T, K>;
}
