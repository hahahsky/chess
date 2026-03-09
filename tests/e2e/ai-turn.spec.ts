import { _electron as electron, expect, test } from "@playwright/test";

test("ai responds with legal move and input lock", async () => {
  const app = await electron.launch({
    args: ["."],
    env: {
      ...process.env,
      APP_TEST_MODE: "ai"
    }
  });
  const window = await app.firstWindow();

  await window.waitForLoadState("domcontentloaded");

  await window.getByTestId("mode-ai").click();
  await window.getByTestId("square-e2").click();
  await window.getByTestId("square-e4").click();

  await expect(window.getByTestId("status-banner")).toContainText("AI 생각 중");
  await window.getByTestId("square-g1").click();
  await window.getByTestId("square-g1").click();

  await expect(window.getByTestId("move-history")).toContainText("e4");
  await expect(window.getByTestId("move-history")).not.toHaveText(/^\s*$/);
  await window.screenshot({ path: ".sisyphus/evidence/task-7-ai-response.png" });

  await app.close();
});
