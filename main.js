const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    autoHideMenuBar: true,
    title: 'Typy',
    frame: false, // Hide the title bar and window frame
    icon: path.join(__dirname, 'icon.ico')
  });
  win.loadFile('index.html');

  // Listen for move-window events from renderer
  const { ipcMain } = require('electron');
  ipcMain.on('move-window', (event, { dx, dy }) => {
    const [x, y] = win.getPosition();
    win.setPosition(x + dx, y + dy);
  });
  ipcMain.on('close-app', () => {
    win.close();
  });

  // Show popup with about/help message
  ipcMain.on('show-thankyou-popup', () => {
    // Calculate position to center the popup based on main window
    const popupWidth = 480;
    const popupHeight = 520;
    const [winX, winY] = win.getPosition();
    const [winWidth, winHeight] = win.getSize();
    const x = Math.round(winX + (winWidth - popupWidth) / 2);
    const y = Math.round(winY + (winHeight - popupHeight) / 2);
    
    let popup = new BrowserWindow({
      width: popupWidth,
      height: popupHeight,
      x: x,
      y: y,
      resizable: false,
      minimizable: false,
      maximizable: false,
      title: 'About Typy',
      autoHideMenuBar: true,
      parent: win,
      modal: true,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        preload: path.join(__dirname, 'preload.js')
      }
    });
    popup.setMenuBarVisibility(false);
    popup.loadFile('about.html');
    popup.on('closed', () => { popup = null; });
  });

  // Always listen for insert-sample-markdown from any window
  ipcMain.on('insert-sample-markdown', (event) => {
    // Read sample.md and send to main window
    const fs = require('fs');
    const samplePath = path.join(__dirname, 'sample.md');
    fs.readFile(samplePath, 'utf8', (err, data) => {
      if (!err) {
        win.webContents.send('set-markdown-text', data);
      }
    });
    // Close the about popup if it exists
    BrowserWindow.getAllWindows().forEach(w => {
      if (w !== win && w.getTitle() === 'About Typy') w.close();
    });
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
