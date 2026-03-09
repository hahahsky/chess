import type { BoardPiece } from "../../../shared/chess/types";

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

const pieceMap: Record<string, string> = {
  wp: "♙",
  wn: "♘",
  wb: "♗",
  wr: "♖",
  wq: "♕",
  wk: "♔",
  bp: "♟",
  bn: "♞",
  bb: "♝",
  br: "♜",
  bq: "♛",
  bk: "♚"
};

interface ChessBoardProps {
  board: Record<string, BoardPiece | null>;
  selectedSquare: string | null;
  onSquareClick: (square: string) => void;
}

export function ChessBoard({ board, selectedSquare, onSquareClick }: ChessBoardProps): JSX.Element {
  return (
    <section data-testid="chess-board" className="board-wrapper" aria-label="체스판">
      {ranks.map((rank) =>
        files.map((file, fileIndex) => {
          const square = `${file}${rank}`;
          const piece = board[square];
          const isDark = (Number(rank) + fileIndex) % 2 === 0;
          const selected = selectedSquare === square;
          const key = piece ? `${piece.color}${piece.type}` : "";
          return (
            <button
              key={square}
              type="button"
              data-testid={`square-${square}`}
              className={`square ${isDark ? "dark" : "light"} ${selected ? "selected" : ""}`}
              onClick={() => onSquareClick(square)}
            >
              <span className="piece" aria-hidden="true">
                {piece ? pieceMap[key] : ""}
              </span>
              {rank === "1" && <span className="coord-file">{file}</span>}
              {file === "a" && <span className="coord-rank">{rank}</span>}
              <span className="sr-only">{square}</span>
            </button>
          );
        })
      )}
    </section>
  );
}
