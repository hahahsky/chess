import { _electron as electron, expect, test } from "@playwright/test";

test("local checkmate flow", async () => {
  const app = await electron.launch({ args: ["."] });
  const window = await app.firstWindow();

  await window.waitForLoadState("domcontentloaded");

  await window.getByTestId("square-f2").click();
  await window.getByTestId("square-f3").click();
  await window.getByTestId("square-e7").click();
  await window.getByTestId("square-e5").click();
  await window.getByTestId("square-g2").click();
  await window.getByTestId("square-g4").click();
  await window.getByTestId("square-d8").click();
  await window.getByTestId("square-h4").click();

  await expect(window.getByTestId("status-banner")).toContainText("체크메이트");
  await window.screenshot({ path: ".sisyphus/evidence/task-6-checkmate.png" });

  await app.close();
});
