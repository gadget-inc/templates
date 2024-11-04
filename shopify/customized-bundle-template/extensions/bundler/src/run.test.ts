import { describe, it, expect } from "vitest";
import { run } from "./run";

import type { RunInput, FunctionRunResult } from "../generated/api";

describe("cart transform function", () => {
  it("returns no operations", () => {
    const result = run({ cart: { lines: [] } } as RunInput);
    const expected: FunctionRunResult = { operations: [] };

    expect(result).toEqual(expected);
  });
});
