import { generateId } from './generateId';

describe('generateId', () => {
  it('generated random id', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
    expect(generateId()).toBe('4fzzzxjylrx');
  });
});
