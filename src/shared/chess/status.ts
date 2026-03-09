import type { Chess } from "chess.js";
import type { GameStatus, PlayerColor } from "./types";

interface FiftyMoveAware {
  isDrawByFiftyMoves?: () => boolean;
}

export function evaluateStatus(chess: Chess): { status: GameStatus; winner: PlayerColor | null } {
  if (chess.isCheckmate()) {
    return { status: "checkmate", winner: chess.turn() === "w" ? "b" : "w" };
  }

  if (chess.isStalemate()) {
    return { status: "stalemate", winner: null };
  }

  const fiftyAware = chess as unknown as FiftyMoveAware;
  if (typeof fiftyAware.isDrawByFiftyMoves === "function" && fiftyAware.isDrawByFiftyMoves()) {
    return { status: "fiftyMoveRule", winner: null };
  }

  if (chess.isInsufficientMaterial()) {
    return { status: "insufficientMaterial", winner: null };
  }

  if (chess.isThreefoldRepetition()) {
    return { status: "threefoldRepetition", winner: null };
  }

  if (chess.isDraw()) {
    return { status: "draw", winner: null };
  }

  if (chess.isCheck()) {
    return { status: "check", winner: null };
  }

  return { status: "playing", winner: null };
}
