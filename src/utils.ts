// Exclude keys from object
export function excludeKeys<CustomObject, Key extends keyof CustomObject>(
  obj: CustomObject,
  ...keys: Key[]
): Omit<CustomObject, Key> {
  for (const key of keys) {
    delete obj[key];
  }
  return obj;
}
