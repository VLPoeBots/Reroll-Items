import { app, ipcMain } from "electron";
import { win } from "../main.js";
import { WriteToFile } from "./LogFiles.js";
import { spawn } from "child_process";
import path from "path";

let DocPath;
let ExePath;
let LogFilePath;
let LiftKeysPath;
let RerollPath;
let RerollFolder;
let LocalDev = process.env.NODE_ENV;
console.log("LocalDev: ", LocalDev);
if (LocalDev === "Dev") {
  DocPath = "C://Users//shacx";
  RerollFolder = "C:/Users/shacx/Documents/RerollLogs";
  LogFilePath = "C:/Users/shacx/Documents/RerollLogs/Logs.txt";
  LiftKeysPath = "C:/Users/shacx/Documents/GitHub/Reroll/python/LiftKeys.py";
  RerollPath = "C:/Users/shacx/Documents/GitHub/Reroll/python/Reroll.py";
} else {
  DocPath = app.getPath("documents");
  ExePath = app.getPath("exe");
  ExePath = ExePath.substring(0, ExePath.lastIndexOf("\\"));
  RerollFolder = path.join(DocPath, "RerollLogs");
  LogFilePath = path.join(RerollFolder, "/Logs.txt");
  LiftKeysPath = path.join(ExePath, "/python/LiftKeys.py");
  RerollPath = path.join(ExePath, "/python/Reroll.py");
}

ipcMain.on("StartCrafting", (event, args) => {
  win.webContents.send("Counter", "reset");

  WriteToFile(LogFilePath, "Program started crafting");
  let ModName = args[0];
  let MaxRolls = args[1];
  let CurrencyCoords = args[2];
  let TabCoords = args[3];
  let CraftMaterial = args[4];
  let Fracture = args[5];
  let ExclusionMods = args[6];
  let SleepTimer = args[7];
  let ModNumber = args[8];
  const StartCrafting = spawn("python", [
    RerollPath,
    ModName,
    MaxRolls,
    CurrencyCoords,
    TabCoords,
    CraftMaterial,
    Fracture,
    ExclusionMods,
    SleepTimer,
    ModNumber,
  ]);

  StartCrafting.stdout.on("data", (data) => {
    let PrintThis = String(data);
    console.log(PrintThis);
    if (PrintThis.includes("MyCounter")) {
      win.webContents.send("Counter", "+");
    }
    if (PrintThis.includes("CurrentBase")) {
      WriteToFile(
        LogFilePath,
        "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
      );

      WriteToFile(LogFilePath, PrintThis);
    }
    if (PrintThis.includes("Matching Line")) {
      // win.webContents.send("Match");
      console.log("Print: ", PrintThis);
    }
    if (PrintThis.includes("RarityError")) {
      win.webContents.send(
        "RarityError",
        "The currency you're trying to use does not match the rarity of your item"
      );
    }
    if (PrintThis.includes("Item Not Found")) {
      console.log("Item not found: ");
      win.webContents.send("ItemError", "Item Not Found");
    }
  });

  StartCrafting.stderr.on("data", (data) => {
    console.error("error: ", String(data));
    let FailSafeArray = [
      "failSafeCheck",
      "fail-safe",
      "mouse moving to a corner",
      "FailSafeException",
      "FAILSAFE",
    ];
    let MyError = `Error with crafting: ${String(data)}`;
    WriteToFile(LogFilePath, `MyError: ${MyError}`);

    if (!FailSafeArray.some((element) => MyError.includes(element))) {
      WriteToFile(LogFilePath, `${MyError}`);
      win.webContents.send("ItemError", MyError);
    }
  });

  StartCrafting.on("exit", (code, signal) => {
    const LiftKeys = spawn("python", [LiftKeysPath]);
    LiftKeys.stderr.on("data", (data) => {
      console.error("Error with liftkeys: ", String(data));
      WriteToFile(LogFilePath, `${String(data)}`);
    });

    if (code !== null) {
      console.log(`Crafting script exited with code ${code}`);
      WriteToFile(LogFilePath, `Crafting script exited with code ${code}`);
    } else if (signal !== null) {
      console.log(`Crafting script was killed by signal ${signal}`);
      WriteToFile(
        LogFilePath,
        `Crafting script was killed by signal ${signal}`
      );
    } else {
      console.log("Crafting script has exited");
      WriteToFile(LogFilePath, "Crafting script has exited");
    }

    WriteToFile(
      LogFilePath,
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    );
  });
});
