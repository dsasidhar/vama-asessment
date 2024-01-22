// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';

export type Channels = 'store-data' | 'get-data';

const electronHandler = {
  ipcRenderer: {
    async storeData(key: string, data: any) {
      await ipcRenderer.invoke('store-data', key, data);
    },

    async getData(key: string) {
      return await ipcRenderer.invoke('get-data', key);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);
export type ElectronHandler = typeof electronHandler;
