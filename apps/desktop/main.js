const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'AI-Chat-Box',
    backgroundColor: '#1e1e1e', // Match VS Code theme
    webPreferences: {
      nodeIntegration: false,    // Best practice for security
      contextIsolation: true,   // Best practice for security
      sandbox: true,            // Best practice for security
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Hide default menu
  win.setMenuBarVisibility(false);

  if (isDev) {
    win.loadURL('http://localhost:5173');
    // Open the DevTools.
    // win.webContents.openDevTools();
  } else {
    // In production, load the static build
    win.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  }

  win.on('closed', () => {
    app.quit();
  });
}

// IPC Example: Handle messages from renderer
ipcMain.on('toMain', (event, args) => {
  console.log('Received in Main:', args);
  // Send back
  event.reply('fromMain', `Hello from Electron Main Process! Received: ${args}`);
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
