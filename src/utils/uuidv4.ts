// ----------------------------------------------------------------------

export default function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function randomKey(value: string | number, prefix = 'id'): string {
  const stringValue = String(value);

  let hash = 0;
  for (let i = 0; i < stringValue.length; i++) {
    const char = stringValue.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return `${prefix}-${Math.abs(hash)}`;
}
