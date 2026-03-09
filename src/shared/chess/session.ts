import { Chess, type PieceSymbol, type Square } from "chess.js";
import { pickBeginnerMove } from "./ai";
import { evaluateStatus } from "./status";
import type { GameMode, MoveEntry, MoveResult, SessionState } from "./types";

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

function buildBoard(chess: Chess): SessionState["board"] {
  const board: SessionState["board"] = {};
  for (const file of files) {
    for (const rank of ranks) {
      const square = `${file}${rank}`;
      const piece = chess.get(square as Square);
      board[square] = piece ? { color: piece.color, type: piece.type } : null;
    }
  }
  return board;
}

export class GameSession {
  private chess: Chess;
  private history: MoveEntry[];
  private selectedSquare: string | null;
  private mode: GameMode;
  private pendingPromotion: SessionState["pendingPromotion"];

  constructor(mode: GameMode = "local", fen?: string) {
    this.chess = fen ? new Chess(fen) : new Chess();
    this.mode = mode;
    this.history = [];
    this.selectedSquare = null;
    this.pendingPromotion = null;
  }

  private toSquare(value: string): Square | null {
    return /^[a-h][1-8]$/.test(value) ? (value as Square) : null;
  }

  getState(): SessionState {
    const { status, winner } = evaluateStatus(this.chess);
    const legalMoves = this.chess
      .moves({ verbose: true })
      .map((move) => `${move.from}${move.to}${move.promotion ?? ""}`);
    return {
      fen: this.chess.fen(),
      turn: this.chess.turn(),
      mode: this.mode,
      status,
      winner,
      board: buildBoard(this.chess),
      history: [...this.history],
      legalMoves,
      selectedSquare: this.selectedSquare,
      pendingPromotion: this.pendingPromotion
    };
  }

  setSelectedSquare(square: string | null): SessionState {
    this.selectedSquare = square;
    return this.getState();
  }

  setMode(mode: GameMode): SessionState {
    this.mode = mode;
    return this.newGame(mode);
  }

  newGame(mode = this.mode, fen?: string): SessionState {
    this.mode = mode;
    this.chess = fen ? new Chess(fen) : new Chess();
    this.history = [];
    this.selectedSquare = null;
    this.pendingPromotion = null;
    return this.getState();
  }

  private needsPromotion(from: string, to: string): boolean {
    const fromSquare = this.toSquare(from);
    if (!fromSquare) {
      return false;
    }
    const piece = this.chess.get(fromSquare);
    if (!piece || piece.type !== "p") {
      return false;
    }
    const destinationRank = to.slice(1);
    return destinationRank === "1" || destinationRank === "8";
  }

  tryMove(from: string, to: string, promotion?: PieceSymbol): MoveResult {
    const fromSquare = this.toSquare(from);
    const toSquare = this.toSquare(to);
    if (!fromSquare || !toSquare) {
      return { ok: false, state: this.getState(), reason: "illegal" };
    }

    if (!promotion && this.needsPromotion(fromSquare, toSquare)) {
      const piece = this.chess.get(fromSquare);
      if (piece) {
        this.pendingPromotion = { from: fromSquare, to: toSquare, color: piece.color };
      }
      return { ok: false, state: this.getState(), reason: "promotion-required" };
    }

    try {
      const move = this.chess.move({ from: fromSquare, to: toSquare, promotion });
      this.history.push({ from: move.from, to: move.to, san: move.san, promotion: move.promotion });
      this.selectedSquare = null;
      this.pendingPromotion = null;
      return { ok: true, state: this.getState() };
    } catch {
      return { ok: false, state: this.getState(), reason: "illegal" };
    }
  }

  applyAiMove(options: { depth?: number; timeLimitMs?: number } = {}): MoveResult {
    const move = pickBeginnerMove(this.chess.fen(), options);
    if (!move) {
      return { ok: false, state: this.getState(), reason: "illegal" };
    }
    return this.tryMove(move.from, move.to, move.promotion);
  }
}

export function createGameSession(mode: GameMode = "local", fen?: string): GameSession {
  return new GameSession(mode, fen);
}
