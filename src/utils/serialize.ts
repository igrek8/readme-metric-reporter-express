export function serialize(value: unknown) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}
