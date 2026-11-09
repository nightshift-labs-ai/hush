// Sandboxed preload, bundled by esbuild: the official SDK bridge plus one call that fetches the key from main.
require('@smartspectra/node-sdk/preload');
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('hushKey', () => ipcRenderer.invoke('hush:key'));
