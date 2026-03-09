import { _electron as electron, expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";

test("electron app launches", async () => {
  await mkdir(".sisyphus/evidence", { recursive: true });
  const app = await electron.launch({ args: ["."] });
  const window = await app.firstWindow();

  await window.waitForLoadState("domcontentloaded");
  await expect(window.getByTestId("chess-board")).toBeVisible();
  await window.screenshot({ path: ".sisyphus/evidence/task-8-build-launch.png" });

  await app.close();
});
