const { ipcRenderer, contextBridge } = require("electron");
// const { call } = require("function-bind");
// console.log("Preload script is running");

contextBridge.exposeInMainWorld("api", {
  // GetIconPath: (callback) => {
  //   console.log("Setting up IPC listener for GetIconPath");

  //   ipcRenderer.on("GetIconPath", (event, data) => {
  //     console.log("Preload received: ", data);
  //   });
  // },
  GetIconPath: (callback) => ipcRenderer.on("GetIconPath", callback),
  RarityError: (callback) => ipcRenderer.on("ItemError", callback),
  MousePos: (callback) => ipcRenderer.on("MouseCoords", callback),
  Logfile: (callback) => ipcRenderer.on("Logfile", callback),
  ClearMods: (callback) => ipcRenderer.on("ClearMods", callback),
  SaveIconsData: (callback) => ipcRenderer.on("SaveIconsData", callback), // Used to display SaveIcons on frontend
  ExportItemsListener: (callback) => ipcRenderer.on("ExportItem", callback),

  ImportItemsListener: (callback) => ipcRenderer.on("ImportItem", callback),
  ClearLocalStorage: (callback) =>
    ipcRenderer.on("ClearLocalStorage", callback),

  ItemError: (callback) => ipcRenderer.on("RarityError", callback),

  StartCraft: (callback) => ipcRenderer.on("StartCraft", callback),
  GlobalKey: (callback) => ipcRenderer.on("GlobalKey", callback),
  Counter: (callback) => ipcRenderer.on("Counter", callback),
  LoadSaveIconPics: (callback) =>
    ipcRenderer.send("LoadSaveIconPics", callback),
  TriggerCurrencyUse: (callback) => {
    ipcRenderer.send("TriggerCurrencyUse", callback);
  },
  FocusFix: (callback) => {
    ipcRenderer.send("FocusFix", callback);
  },
  ReturnExportData: (callback) => {
    ipcRenderer.send("ReturnExportData", callback);
  },
  ResizeWindow: (callback) => {
    ipcRenderer.send("ResizeWindow", callback);
  },
  StartCrafting: (callback) => {
    ipcRenderer.send("StartCrafting", callback);
  },
  ScreenRatio: (callback) => {
    ipcRenderer.send("ScreenRatio");
  },
  ScreenRatioValue: (callback) => {
    ipcRenderer.on("ScreenRatioValue", (event, ...args) => {
      callback(...args);
    });
  },
});
window.addEventListener("error", (event) => {
  console.log("Error event:", event);
});
