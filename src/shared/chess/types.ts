import type { PieceSymbol } from "chess.js";

export type PlayerColor = "w" | "b";
export type GameMode = "local" | "ai";
export type GameStatus =
  | "playing"
  | "check"
  | "checkmate"
  | "stalemate"
  | "threefoldRepetition"
  | "fiftyMoveRule"
  | "insufficientMaterial"
  | "draw";

export interface BoardPiece {
  color: PlayerColor;
  type: PieceSymbol;
}

export interface MoveEntry {
  from: string;
  to: string;
  san: string;
  promotion?: PieceSymbol;
}

export interface PromotionRequest {
  from: string;
  to: string;
  color: PlayerColor;
}

export interface SessionState {
  fen: string;
  turn: PlayerColor;
  mode: GameMode;
  status: GameStatus;
  winner: PlayerColor | null;
  board: Record<string, BoardPiece | null>;
  history: MoveEntry[];
  legalMoves: string[];
  selectedSquare: string | null;
  pendingPromotion: PromotionRequest | null;
}

export interface MoveResult {
  ok: boolean;
  state: SessionState;
  reason?: "illegal" | "promotion-required";
}
