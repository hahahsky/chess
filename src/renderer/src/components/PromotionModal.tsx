import { ko } from "../../../shared/chess/strings/ko";
import type { PieceSymbol } from "chess.js";
import type { PromotionRequest } from "../../../shared/chess/types";

interface PromotionModalProps {
  pendingPromotion: PromotionRequest | null;
  onSelect: (promotion: PieceSymbol) => void;
}

const options: Array<{ id: string; value: PieceSymbol; label: string }> = [
  { id: "queen", value: "q", label: ko.promotionQueen },
  { id: "rook", value: "r", label: ko.promotionRook },
  { id: "bishop", value: "b", label: ko.promotionBishop },
  { id: "knight", value: "n", label: ko.promotionKnight }
];

export function PromotionModal({ pendingPromotion, onSelect }: PromotionModalProps): JSX.Element | null {
  if (!pendingPromotion) {
    return null;
  }

  return (
    <section data-testid="promotion-modal" className="promotion-modal">
      <h2>{ko.promotionTitle}</h2>
      <div>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            data-testid={`promotion-${option.id}`}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
