import type { MoveEntry } from "../../../shared/chess/types";
import { ko } from "../../../shared/chess/strings/ko";

interface MoveHistoryProps {
  history: MoveEntry[];
}

export function MoveHistory({ history }: MoveHistoryProps): JSX.Element {
  return (
    <section>
      <h2>{ko.moveHistory}</h2>
      <ol data-testid="move-history">
        {history.map((move, index) => (
          <li key={`${move.san}-${index}`}>{move.san}</li>
        ))}
      </ol>
    </section>
  );
}
