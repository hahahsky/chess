import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { evaluateStatus } from "../../src/shared/chess/status";
import { fixtures } from "../fixtures/chess-fixtures";

describe("rules fixtures", () => {
  it("denies castling through check and without rights", () => {
    const throughCheck = new Chess(fixtures.castlingThroughCheck);
    const noRights = new Chess(fixtures.noCastlingRights);

    expect(throughCheck.moves()).not.toContain("O-O");
    expect(noRights.moves()).not.toContain("O-O");
  });

  it("handles en passant immediacy", () => {
    const ready = new Chess(fixtures.enPassantReady);
    const notReady = new Chess(fixtures.enPassantNotAvailable);

    expect(ready.moves()).toContain("exd6");
    expect(notReady.moves()).not.toContain("exd6");
  });

  it("supports underpromotion and promotion checkmate path", () => {
    const promotion = new Chess(fixtures.underPromotion);
    promotion.move({ from: "a7", to: "a8", promotion: "n" });
    expect(promotion.fen()).toContain("N3k3");

    const mate = new Chess();
    mate.move("f3");
    mate.move("e5");
    mate.move("g4");
    mate.move("Qh4#");
    expect(evaluateStatus(mate).status).toBe("checkmate");
  });

  it("detects stalemate and insufficient material", () => {
    expect(evaluateStatus(new Chess(fixtures.stalemate)).status).toBe("stalemate");
    expect(evaluateStatus(new Chess(fixtures.insufficientMaterial)).status).toBe("insufficientMaterial");
  });

  it("auto-declares threefold repetition and fifty-move draw", () => {
    const repetition = new Chess();
    repetition.move("Nf3");
    repetition.move("Nf6");
    repetition.move("Ng1");
    repetition.move("Ng8");
    repetition.move("Nf3");
    repetition.move("Nf6");
    repetition.move("Ng1");
    repetition.move("Ng8");

    expect(evaluateStatus(repetition).status).toBe("threefoldRepetition");
    expect(evaluateStatus(new Chess(fixtures.fiftyMoveRule)).status).toBe("fiftyMoveRule");
  });
});
