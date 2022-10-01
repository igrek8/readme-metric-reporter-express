import { serialize } from './serialize';

describe('serialize', () => {
  it('serializes to string', () => {
    expect(serialize('test')).toBe('test');
    expect(serialize({ test: true })).toBe('{"test":true}');
  });
});
