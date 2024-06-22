import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("ipc", electronAPI.ipcRenderer);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.ipc = electronAPI.ipcRenderer;
}
