import { colorLabel, ko, statusLabel } from "../../../shared/chess/strings/ko";
import type { SessionState } from "../../../shared/chess/types";

interface StatusBannerProps {
  state: SessionState;
  isAiThinking: boolean;
}

export function StatusBanner({ state, isAiThinking }: StatusBannerProps): JSX.Element {
  return (
    <section data-testid="status-banner">
      <p>
        {ko.turn}: {colorLabel(state.turn)}
      </p>
      <p>{isAiThinking ? ko.aiThinking : statusLabel(state.status, state.winner)}</p>
    </section>
  );
}
