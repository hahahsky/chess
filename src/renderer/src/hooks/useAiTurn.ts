import { useEffect } from "react";
import type { GameSession } from "../../../shared/chess/session";
import type { SessionState } from "../../../shared/chess/types";

interface UseAiTurnOptions {
  session: GameSession;
  state: SessionState;
  setState: (state: SessionState) => void;
  isAiThinking: boolean;
  setIsAiThinking: (thinking: boolean) => void;
  aiDepth: number;
  aiTimeLimitMs: number;
}

export function useAiTurn({
  session,
  state,
  setState,
  isAiThinking,
  setIsAiThinking,
  aiDepth,
  aiTimeLimitMs
}: UseAiTurnOptions): void {
  const terminalStatuses = new Set([
    "checkmate",
    "stalemate",
    "threefoldRepetition",
    "fiftyMoveRule",
    "insufficientMaterial",
    "draw"
  ]);

  useEffect(() => {
    if (
      state.mode !== "ai" ||
      state.turn !== "b" ||
      terminalStatuses.has(state.status) ||
      isAiThinking
    ) {
      return;
    }

    setIsAiThinking(true);
    const timer = setTimeout(() => {
      const result = session.applyAiMove({ depth: aiDepth, timeLimitMs: aiTimeLimitMs });
      setState(result.state);
      setIsAiThinking(false);
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [aiDepth, aiTimeLimitMs, isAiThinking, session, setIsAiThinking, setState, state]);
}
