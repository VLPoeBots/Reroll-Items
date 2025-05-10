import path from "path";
import fs from "fs";
import pkg from "electron-updater";
const { autoUpdater } = pkg;
import {
  app,
  BrowserWindow,
  globalShortcut,
  screen,
  ipcMain,
  Menu,
  nativeTheme,
  dialog,
} from "electron";

import { EventEmitter } from "events";
import "./HelperFunctionsBackend/LogFiles.js";
import {
  CreateLogFolder,
  DeleteFileContent,
  OpenFile,
  WriteToFile,
  LoadItem,
  ReadFolder,
} from "./HelperFunctionsBackend/LogFiles.js";
import {
  CheckPython,
  CheckPyPackage,
} from "./HelperFunctionsBackend/PythonCheck.js";
import "./HelperFunctionsBackend/Craft.js";
import "./HelperFunctionsBackend/ExportFile.js";
import "./HelperFunctionsBackend/UseCurrency.js";
nativeTheme.themeSource = "dark";
//
//
//
let LocalDev = process.env.NODE_ENV;
//#region AutoUpdater
autoUpdater.checkForUpdatesAndNotify();
//#endregion
//
//
//
//
//
let win;
let LogFilePath;
let ScreenRatio;
let NewMenuTemplate;
let CaptureMouseEvent = new EventEmitter();
let MousePosition;
let ExePath = app.getPath("exe");
ExePath = ExePath.substring(0, ExePath.lastIndexOf("\\"));
let PreloadPath = path.join(app.getAppPath(), "/renderer/preload.js");
//awdawdawdad
const CreateWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    x: 490,
    y: 0,
    title: `AutoReroll v${app.getVersion()}`,

    webPreferences: {
      nodeIntegration: false,
      sandbox: true,
      contextIsolation: true,
      preload: PreloadPath,
      contentSecurityPolicy:
        "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; manifest-src 'self';",
    },
  });

  win.loadFile("renderer/index.html");
};

app.whenReady().then(() => {
  globalShortcut.unregisterAll();
  CreateWindow();

  let DocPath = app.getPath("documents");
  let RerollFolder = path.join(DocPath, "RerollLogs");
  LogFilePath = path.join(RerollFolder, "/Logs.txt");
  CreateLogFolder(RerollFolder, DocPath);
  WriteToFile(LogFilePath, `AutoReroll version: ${app.getVersion()}`);

  CheckPython(LogFilePath);
  CheckPyPackage("pyautogui", LogFilePath);
  CheckPyPackage("pyperclip", LogFilePath);
  win.ELECTRON_ENABLE_SECURITY_WARNINGS = false;
  let SaveIconsFolder;
  if (LocalDev === "Dev") {
    SaveIconsFolder =
      "C:\\Program Files\\AutoReroll\\resources\\app.asar.unpacked\\renderer\\SaveIconPics";
    // win.webContents.send("GetIconPath", SaveIconsFolder);
  } else {
    SaveIconsFolder = path.join(
      app.getPath("exe").replace("AutoReroll.exe", ""),
      "resources",
      "app.asar.unpacked",
      "renderer",
      "SaveIconPics"
    );

    // win.webContents.send("GetIconPath", SaveIconsFolder);
  }
  win.webContents.on("did-finish-load", () => {
    win.webContents.send("GetIconPath", SaveIconsFolder);
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
  let OpenLogs = globalShortcut.register("F2", () => {
    try {
      OpenFile(LogFilePath);
    } catch (err) {
      WriteToFile(LogFilePath, "Error opening the logfile: " + err);
      win.webContents.send("error", "Error opening the logfile: " + err);
    }
  });
  let MouseCapture = globalShortcut.register("F1", () => {
    // win.focus();
    MousePosition = screen.getCursorScreenPoint();
    MousePosition = JSON.stringify(MousePosition);
    MousePosition = MousePosition.replace(/[^\d,]/g, "");
    CaptureMouseEvent.emit("Coords", MousePosition);
  });
  let DeleteLogs = globalShortcut.register("F4", () => {
    try {
      DeleteFileContent(LogFilePath);
      win.webContents.send("Logfile", "Deleted the log files!");
    } catch (err) {
      WriteToFile(
        LogFilePath,
        `Error deleting the ${LogFilePath} file: " + err`
      );
      win.webContents.send(
        "Logfile",
        `Error deleting the file ${LogFilePath} :  + ${err}`
      );
    }
  });
  const StartCraft = globalShortcut.register("Control+Enter", () => {
    win.webContents.send("StartCraft", "Crafting Started");
  });

  const Scour = globalShortcut.register("Control+Backspace", () => {
    win.webContents.send("GlobalKey", "ScourOrb");
  });
  const Augment = globalShortcut.register("Shift+Enter", () => {
    win.webContents.send("GlobalKey", "AugOrb");
  });
  const Annul = globalShortcut.register("Shift+Backspace", () => {
    win.webContents.send("GlobalKey", "AnnulOrb");
  });
  const Regal = globalShortcut.register("Control+Shift+Enter", () => {
    win.webContents.send("GlobalKey", "RegalOrb");
  });
  const Transmute = globalShortcut.register("Control+Alt+Enter", () => {
    win.webContents.send("GlobalKey", "TransmuteOrb");
  });
  ipcMain.on("LoadSaveIconPics", async (event, data) => {
    if (data === "InitialRequest") {
      let IconPics = await ReadFolder(LogFilePath, SaveIconsFolder);
      win.webContents.send("SaveIconsData", [SaveIconsFolder, IconPics]);
    }
  });
  ipcMain.on("FocusFix", (e, d) => {
    win.blur();
    win.focus();
  });
  ScreenRatio = screen.getPrimaryDisplay().scaleFactor;
  ipcMain.on("ScreenRatio", (event) => {
    event.reply("ScreenRatioValue", ScreenRatio);
  });
  CaptureMouseEvent.on("Coords", (data) => {
    win.webContents.send("MouseCoords", data);
  });
  win.webContents.send("ScreenRatio", ScreenRatio);
  process.on("uncaughtException", (error) => {
    console.error("An uncaught exception occurred:", error);
  });
  NewMenuTemplate = [
    {
      label: "Hotkeys",
      submenu: [
        {
          label: "Capture Mouse position",
          accelerator: "F1",
          click() {
            win.focus();
            MousePosition = screen.getCursorScreenPoint();
            MousePosition = JSON.stringify(MousePosition);
            MousePosition = MousePosition.replace(/[^\d,]/g, "");
            CaptureMouseEvent.emit("Coords", MousePosition);
          },
        },
        {
          label: "Reload",
          accelerator: "Ctrl+R",
          role: "forceReload",
        },
        {
          label: "Dev tools",
          role: "toggleDevTools",
          accelerator: "Ctrl+`",
        },

        {
          label: "Import an Item",
          accelerator: "Ctrl+q",

          click() {
            let MyFile = dialog.showOpenDialogSync(win, {
              properties: [OpenFile],
              filters: [{ name: "Text", extensions: ["txt"] }],
            });
            let MyFileContent = fs.readFileSync(MyFile[0], {
              encoding: "utf8",
              flag: "r",
            });
            let ItemMods = LoadItem(MyFileContent);
            win.webContents.send("ClearMods", "awd");
            win.webContents.send("ImportItem", ItemMods);
          },
        },
        {
          label: "Export Current Item",
          accelerator: "Ctrl+e",

          click() {
            dialog
              .showSaveDialog(win, {
                defaultPath: "ExportedItem",

                filters: [{ name: "Text", extensions: ["txt"] }],
              })
              .then((result) => {
                if (!result.canceled && result.filePath) {
                  win.webContents.send("ExportItem", result.filePath);
                }
              });
          },
        },
        {
          label: "Clear all mods",
          accelerator: "Ctrl+w",

          click() {
            win.webContents.send("ClearMods", "awd");
          },
        },

        { type: "separator" },
        { label: "Exit", role: "quit" },
      ],
    },
    {
      label: "Options",
      submenu: [
        {
          label: "Clear All stored coords",
          click: async () => {
            let MsgRes = await dialog.showMessageBox({
              message:
                "Are you sure you want to delete ALL coords?\nThis will reset AutoReroll completely",
              type: "question",
              buttons: ["OK", "Cancel"],
              title: "Reset all coords",
            });
            if (MsgRes.response === 0) {
              win.webContents.send("ClearLocalStorage", "awd");
            }
          },
        },
        {
          label: "Open icon folder",
          click: async () => {
            OpenFile(SaveIconsFolder);
          },
        },
      ],
    },
    {
      label: "Logs",
      submenu: [
        {
          label: "Open logs",
          accelerator: "F2",
          click() {
            try {
              OpenFile(LogFilePath);
            } catch (err) {
              WriteToFile(LogFilePath, "Error opening the logfile: " + err);
              win.webContents.send(
                "error",
                "Error opening the logfile: " + err
              );
            }
          },
        },
        {
          label: "Delete logs",
          accelerator: "F4",
          click() {
            try {
              DeleteFileContent(LogFilePath);
              win.webContents.send("Logfile", "Deleted the log files!");
            } catch (err) {
              WriteToFile(
                LogFilePath,
                `Error deleting the ${LogFilePath} file: " + err`
              );
              win.webContents.send(
                "Logfile",
                `Error deleting the file ${LogFilePath} :  + ${err}`
              );
            }
          },
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(NewMenuTemplate);
  Menu.setApplicationMenu(menu);
});

export { win };
