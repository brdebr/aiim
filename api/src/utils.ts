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

// Format bytes to human readable string
export function bytesToHuman(bytes: number) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
