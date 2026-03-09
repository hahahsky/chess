import { describe, expect, it } from "vitest";
import { createGameSession } from "../../src/shared/chess/session";
import { fixtures } from "../fixtures/chess-fixtures";

describe("chess session", () => {
  it("applies e2e4 and updates fen/history", () => {
    const session = createGameSession("local");
    const result = session.tryMove("e2", "e4");

    expect(result.ok).toBe(true);
    expect(result.state.turn).toBe("b");
    expect(result.state.history.at(-1)?.san).toBe("e4");
    expect(result.state.fen).toContain(" b ");
  });

  it("rejects illegal move e2e5", () => {
    const session = createGameSession("local");
    const before = session.getState();
    const result = session.tryMove("e2", "e5");

    expect(result.ok).toBe(false);
    expect(result.reason).toBe("illegal");
    expect(result.state.fen).toBe(before.fen);
    expect(result.state.history).toHaveLength(0);
  });

  it("resets game state", () => {
    const session = createGameSession("local");
    session.tryMove("e2", "e4");
    const reset = session.newGame();

    expect(reset.history).toHaveLength(0);
    expect(reset.turn).toBe("w");
    expect(reset.status).toBe("playing");
  });

  it("blocks any move after checkmate", () => {
    const session = createGameSession("local");

    session.tryMove("f2", "f3");
    session.tryMove("e7", "e5");
    session.tryMove("g2", "g4");
    const mate = session.tryMove("d8", "h4");

    expect(mate.ok).toBe(true);
    expect(mate.state.status).toBe("checkmate");

    const blocked = session.tryMove("a2", "a3");
    expect(blocked.ok).toBe(false);
    expect(blocked.reason).toBe("illegal");
    expect(blocked.state.history.at(-1)?.san).toBe("Qh4#");
  });

  it("blocks interactions when game starts in stalemate", () => {
    const session = createGameSession("local", fixtures.stalemate);
    const initial = session.getState();

    expect(initial.status).toBe("stalemate");

    const selected = session.setSelectedSquare("h8");
    expect(selected.selectedSquare).toBeNull();

    const blocked = session.tryMove("h8", "h7");
    expect(blocked.ok).toBe(false);
    expect(blocked.reason).toBe("illegal");
    expect(blocked.state.history).toHaveLength(0);
  });

  it("blocks interactions when game starts in draw state", () => {
    const session = createGameSession("local", fixtures.fiftyMoveRule);
    const initial = session.getState();

    expect(initial.status).toBe("fiftyMoveRule");

    const blocked = session.tryMove("a1", "a2");
    expect(blocked.ok).toBe(false);
    expect(blocked.reason).toBe("illegal");
    expect(blocked.state.status).toBe("fiftyMoveRule");

    const aiBlocked = session.applyAiMove();
    expect(aiBlocked.ok).toBe(false);
    expect(aiBlocked.reason).toBe("illegal");
  });
});
