import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { pickBeginnerMove } from "../../src/shared/chess/ai";

describe("beginner ai", () => {
  it("returns a legal deterministic move", () => {
    const chess = new Chess();
    chess.move("e4");
    const fen = chess.fen();

    const startedAt = Date.now();
    const first = pickBeginnerMove(fen, { depth: 2, timeLimitMs: 5000 });
    const elapsed = Date.now() - startedAt;
    const second = pickBeginnerMove(fen, { depth: 2, timeLimitMs: 5000 });

    expect(first).not.toBeNull();
    expect(second).toEqual(first);

    const legal = chess
      .moves({ verbose: true })
      .map((move) => `${move.from}${move.to}${move.promotion ?? ""}`);
    expect(legal).toContain(`${first?.from}${first?.to}${first?.promotion ?? ""}`);
    expect(elapsed).toBeLessThanOrEqual(5000);
  });
});
