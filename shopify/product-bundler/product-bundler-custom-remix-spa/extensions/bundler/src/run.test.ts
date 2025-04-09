import { describe, it, expect } from 'vitest';
import { run } from './run';
import { FunctionRunResult } from '../generated/api';

describe('cart transform function', () => {
  it('returns no operations', () => {
    const result = run({
      cart: {
        lines: []
      }
    });
    const expected: FunctionRunResult = { operations: [] };

    expect(result).toEqual(expected);
  });
});