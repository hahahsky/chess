import { _electron as electron, expect, test } from "@playwright/test";
import { fixtures } from "../fixtures/chess-fixtures";

test("promotion flow", async () => {
  const app = await electron.launch({
    args: ["."],
    env: {
      ...process.env,
      APP_TEST_FEN: fixtures.underPromotion
    }
  });
  const window = await app.firstWindow();

  await window.waitForLoadState("domcontentloaded");

  await window.getByTestId("square-a7").click();
  await window.getByTestId("square-a8").click();
  await expect(window.getByTestId("promotion-modal")).toBeVisible();
  await window.getByTestId("promotion-queen").click();
  await expect(window.getByTestId("square-a8")).toContainText("♕");
  await window.screenshot({ path: ".sisyphus/evidence/task-6-promotion.png" });

  await app.close();
});
