import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { runEngineSelfTest } from "./engine.selftest.ts";

describe("HZCN simulation self-test", () => {
  it("satisfies the 120-second campus scenario", () => {
    const errors = runEngineSelfTest();
    assert.deepEqual(errors, [], errors.join("; "));
  });
});
