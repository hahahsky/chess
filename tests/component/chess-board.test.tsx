import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../../src/renderer/src/App";

describe("chess board", () => {
  it("renders 64 squares and korean labels", () => {
    render(<App />);
    const squares = screen.getAllByRole("button").filter((button) =>
      button.getAttribute("data-testid")?.startsWith("square-")
    );

    expect(squares).toHaveLength(64);
    expect(screen.getByText("새 게임")).toBeInTheDocument();
    expect(screen.getByText("로컬 2인")).toBeInTheDocument();
    expect(screen.getByText("AI 대전")).toBeInTheDocument();
  });

  it("moves pawn from e2 to e4 via board clicks", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("square-e2"));
    fireEvent.click(screen.getByTestId("square-e4"));

    expect(screen.getByTestId("square-e4").textContent).toContain("♙");
    expect(screen.getByTestId("move-history").textContent).toContain("e4");
  });

  it("ignores illegal target selection from e2 to e5", () => {
    render(<App />);
    const before = screen.getByTestId("square-e2").textContent;
    fireEvent.click(screen.getByTestId("square-e2"));
    fireEvent.click(screen.getByTestId("square-e5"));

    expect(screen.getByTestId("square-e2").textContent).toBe(before);
    expect(screen.getByTestId("move-history").textContent).toBe("");
  });
});
