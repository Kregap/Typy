const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  moveWindow: (dx, dy) => ipcRenderer.send("move-window", { dx, dy }),
  closeApp: () => ipcRenderer.send("close-app"),
  showThankYou: () => ipcRenderer.send("show-thankyou-popup"),
  insertSampleMarkdown: () => ipcRenderer.send("insert-sample-markdown"),
  onSetMarkdownText: callback =>
    ipcRenderer.on("set-markdown-text", (event, text) => callback(text))
});
