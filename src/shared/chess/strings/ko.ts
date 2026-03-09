import type { GameMode, GameStatus, PlayerColor } from "../types";

export const ko = {
  appTitle: "체스 인디 데스크톱",
  modeLocal: "로컬 2인",
  modeAi: "AI 대전",
  aiDifficulty: "AI 난이도",
  aiEasy: "쉬움",
  aiNormal: "보통",
  newGame: "새 게임",
  turn: "현재 차례",
  white: "백",
  black: "흑",
  aiThinking: "AI 생각 중",
  moveHistory: "기보",
  promotionTitle: "프로모션 선택",
  promotionQueen: "퀸",
  promotionRook: "룩",
  promotionBishop: "비숍",
  promotionKnight: "나이트"
};

export function modeLabel(mode: GameMode): string {
  return mode === "local" ? ko.modeLocal : ko.modeAi;
}

export function colorLabel(color: PlayerColor): string {
  return color === "w" ? ko.white : ko.black;
}

export function statusLabel(status: GameStatus, winner: PlayerColor | null): string {
  switch (status) {
    case "check":
      return "체크";
    case "checkmate":
      return winner ? `체크메이트 - ${colorLabel(winner)} 승리` : "체크메이트";
    case "stalemate":
      return "무승부 - 스테일메이트";
    case "threefoldRepetition":
      return "무승부 - 3회 반복";
    case "fiftyMoveRule":
      return "무승부 - 50수 규칙";
    case "insufficientMaterial":
      return "무승부 - 기물 부족";
    case "draw":
      return "무승부";
    default:
      return "진행 중";
  }
}
