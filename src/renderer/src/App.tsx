import { useRef, useState } from "react";
import type { PieceSymbol } from "chess.js";
import { createGameSession, type GameSession } from "../../shared/chess/session";
import { ko } from "../../shared/chess/strings/ko";
import type { GameMode, SessionState } from "../../shared/chess/types";
import { ChessBoard } from "./components/ChessBoard";
import { MoveHistory } from "./components/MoveHistory";
import { PromotionModal } from "./components/PromotionModal";
import { StatusBanner } from "./components/StatusBanner";
import { useAiTurn } from "./hooks/useAiTurn";
import "./app.css";

interface AppProps {
  initialFen?: string;
  initialMode?: GameMode;
}

function isHumanTurn(state: SessionState): boolean {
  if (state.mode === "local") {
    return true;
  }
  return state.turn === "w";
}

function isTerminalStatus(status: SessionState["status"]): boolean {
  return [
    "checkmate",
    "stalemate",
    "threefoldRepetition",
    "fiftyMoveRule",
    "insufficientMaterial",
    "draw"
  ].includes(status);
}

function App({ initialFen, initialMode = "local" }: AppProps): JSX.Element {
  const sessionRef = useRef<GameSession>(createGameSession(initialMode, initialFen));
  const [state, setState] = useState<SessionState>(sessionRef.current.getState());
  const [isAiThinking, setIsAiThinking] = useState(false);

  useAiTurn({
    session: sessionRef.current,
    state,
    setState,
    isAiThinking,
    setIsAiThinking
  });

  const onSquareClick = (square: string): void => {
    if (!isHumanTurn(state) || isAiThinking || isTerminalStatus(state.status)) {
      return;
    }

    if (!state.selectedSquare) {
      const targetPiece = state.board[square];
      if (!targetPiece || targetPiece.color !== state.turn) {
        return;
      }
      setState(sessionRef.current.setSelectedSquare(square));
      return;
    }

    if (state.selectedSquare === square) {
      setState(sessionRef.current.setSelectedSquare(null));
      return;
    }

    const result = sessionRef.current.tryMove(state.selectedSquare, square);
    setState(result.state);
  };

  const onPromotionSelect = (promotion: PieceSymbol): void => {
    if (!state.pendingPromotion) {
      return;
    }
    const result = sessionRef.current.tryMove(
      state.pendingPromotion.from,
      state.pendingPromotion.to,
      promotion
    );
    setState(result.state);
  };

  const onModeChange = (mode: GameMode): void => {
    setIsAiThinking(false);
    setState(sessionRef.current.setMode(mode));
  };

  const onNewGame = (): void => {
    setIsAiThinking(false);
    setState(sessionRef.current.newGame(state.mode));
  };

  return (
    <main data-testid="chess-app" className="app-shell">
      <header>
        <h1>{ko.appTitle}</h1>
        <div className="control-row">
          <button type="button" data-testid="mode-local" onClick={() => onModeChange("local")}>
            {ko.modeLocal}
          </button>
          <button type="button" data-testid="mode-ai" onClick={() => onModeChange("ai")}>
            {ko.modeAi}
          </button>
          <button type="button" data-testid="new-game-button" onClick={onNewGame}>
            {ko.newGame}
          </button>
        </div>
      </header>

      <StatusBanner state={state} isAiThinking={isAiThinking} />

      <div className="layout">
        <ChessBoard
          board={state.board}
          selectedSquare={state.selectedSquare}
          onSquareClick={onSquareClick}
        />
        <MoveHistory history={state.history} />
      </div>

      <PromotionModal pendingPromotion={state.pendingPromotion} onSelect={onPromotionSelect} />
    </main>
  );
}

export default App;
