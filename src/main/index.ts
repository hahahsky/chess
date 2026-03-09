import { app, BrowserWindow } from "electron";
import { join } from "node:path";

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      sandbox: true
    }
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    const query: Record<string, string> = {};
    if (process.env.APP_TEST_FEN) {
      query.fen = process.env.APP_TEST_FEN;
    }
    if (process.env.APP_TEST_MODE) {
      query.mode = process.env.APP_TEST_MODE;
    }
    void mainWindow.loadFile(join(__dirname, "../renderer/index.html"), {
      query
    });
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
