import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../../src/renderer/src/App";

describe("component smoke", () => {
  it("renders root test id", () => {
    render(<App />);
    expect(screen.getByTestId("chess-app")).toBeInTheDocument();
  });
});
