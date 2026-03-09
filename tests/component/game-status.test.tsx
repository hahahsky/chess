import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../../src/renderer/src/App";
import { fixtures } from "../fixtures/chess-fixtures";

describe("game status", () => {
  it("shows checkmate banner in korean", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("square-f2"));
    fireEvent.click(screen.getByTestId("square-f3"));
    fireEvent.click(screen.getByTestId("square-e7"));
    fireEvent.click(screen.getByTestId("square-e5"));
    fireEvent.click(screen.getByTestId("square-g2"));
    fireEvent.click(screen.getByTestId("square-g4"));
    fireEvent.click(screen.getByTestId("square-d8"));
    fireEvent.click(screen.getByTestId("square-h4"));

    expect(screen.getByTestId("status-banner").textContent).toContain("체크메이트");

    const historyBefore = screen.getByTestId("move-history").textContent ?? "";
    fireEvent.click(screen.getByTestId("square-a2"));
    fireEvent.click(screen.getByTestId("square-a3"));
    const historyAfter = screen.getByTestId("move-history").textContent ?? "";

    expect(historyAfter).toBe(historyBefore);
    expect(historyAfter).toContain("Qh4#");
  });

  it("opens promotion modal and applies queen promotion", () => {
    render(<App initialFen={fixtures.underPromotion} />);
    fireEvent.click(screen.getByTestId("square-a7"));
    fireEvent.click(screen.getByTestId("square-a8"));

    expect(screen.getByTestId("promotion-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("promotion-queen"));
    expect(screen.getByTestId("square-a8").textContent).toContain("♕");
  });
});
