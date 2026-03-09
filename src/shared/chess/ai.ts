import { Chess, type PieceSymbol } from "chess.js";

const pieceScore: Record<PieceSymbol, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0
};

interface CandidateMove {
  from: string;
  to: string;
  promotion?: PieceSymbol;
}

interface SearchGuard {
  deadlineAt: number;
  nodesRemaining: number;
}

const MIN_TIME_LIMIT_MS = 200;
const MAX_TIME_LIMIT_MS = 2000;
const DEFAULT_TIME_LIMIT_MS = 1200;
const NODE_BUDGET = 12000;

function evaluateBoard(chess: Chess): number {
  let score = 0;
  for (const row of chess.board()) {
    for (const piece of row) {
      if (!piece) {
        continue;
      }
      const base = pieceScore[piece.type];
      score += piece.color === "w" ? base : -base;
    }
  }
  const mobility = chess.moves().length * (chess.turn() === "w" ? 0.01 : -0.01);
  return score + mobility;
}

function orderedMoves(chess: Chess): CandidateMove[] {
  return chess
    .moves({ verbose: true })
    .map((move) => ({ from: move.from, to: move.to, promotion: move.promotion }))
    .sort((a, b) => `${a.from}${a.to}${a.promotion ?? ""}`.localeCompare(`${b.from}${b.to}${b.promotion ?? ""}`));
}

function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  guard: SearchGuard
): number {
  if (Date.now() >= guard.deadlineAt || guard.nodesRemaining <= 0) {
    return evaluateBoard(chess);
  }
  guard.nodesRemaining -= 1;

  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess);
  }

  const moves = orderedMoves(chess);
  if (maximizing) {
    let value = -Infinity;
    for (const move of moves) {
      if (Date.now() >= guard.deadlineAt || guard.nodesRemaining <= 0) {
        break;
      }
      chess.move(move);
      value = Math.max(value, minimax(chess, depth - 1, alpha, beta, false, guard));
      chess.undo();
      alpha = Math.max(alpha, value);
      if (beta <= alpha) {
        break;
      }
    }
    return value;
  }

  let value = Infinity;
  for (const move of moves) {
    if (Date.now() >= guard.deadlineAt || guard.nodesRemaining <= 0) {
      break;
    }
    chess.move(move);
    value = Math.min(value, minimax(chess, depth - 1, alpha, beta, true, guard));
    chess.undo();
    beta = Math.min(beta, value);
    if (beta <= alpha) {
      break;
    }
  }
  return value;
}

export function pickBeginnerMove(
  fen: string,
  options: { depth?: number; timeLimitMs?: number } = {}
): CandidateMove | null {
  const chess = new Chess(fen);
  const depth = options.depth ?? 2;
  const requestedLimit = options.timeLimitMs ?? DEFAULT_TIME_LIMIT_MS;
  const timeLimitMs = Math.max(MIN_TIME_LIMIT_MS, Math.min(MAX_TIME_LIMIT_MS, requestedLimit));
  const deadlineAt = Date.now() + timeLimitMs;
  const guard: SearchGuard = { deadlineAt, nodesRemaining: NODE_BUDGET };

  const moves = orderedMoves(chess);
  if (moves.length === 0) {
    return null;
  }

  const maximizing = chess.turn() === "w";
  let bestMove = moves[0];
  let bestScore = maximizing ? -Infinity : Infinity;

  for (const move of moves) {
    if (Date.now() >= guard.deadlineAt || guard.nodesRemaining <= 0) {
      break;
    }
    chess.move(move);
    const score = minimax(chess, depth - 1, -Infinity, Infinity, !maximizing, guard);
    chess.undo();

    if (maximizing ? score > bestScore : score < bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
