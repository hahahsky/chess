import { useEffect } from "react";
import type { GameSession } from "../../../shared/chess/session";
import type { SessionState } from "../../../shared/chess/types";

interface UseAiTurnOptions {
  session: GameSession;
  state: SessionState;
  setState: (state: SessionState) => void;
  isAiThinking: boolean;
  setIsAiThinking: (thinking: boolean) => void;
}

export function useAiTurn({
  session,
  state,
  setState,
  isAiThinking,
  setIsAiThinking
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
      const result = session.applyAiMove({ depth: 2, timeLimitMs: 500 });
      setState(result.state);
      setIsAiThinking(false);
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [isAiThinking, session, setIsAiThinking, setState, state]);
}
