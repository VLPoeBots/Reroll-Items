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
let HarvestRerollPath;
let RerollFolder;
let LocalDev = process.env.NODE_ENV;
let Counter;
console.log("LocalDev: ", LocalDev);
if (LocalDev === "Dev") {
  DocPath = "C:\\Users\\shacx";
  RerollFolder = "C:\\Users\\shacx\\Documents\\RerollLogs";
  LogFilePath = "C:\\Users\\shacx\\Documents\\RerollLogs\\Logs.txt";
  LiftKeysPath =
    "C:\\Users\\shacx\\Documents\\GitHub\\Reroll-Items\\python\\LiftKeys.py";
  RerollPath =
    "C:\\Users\\shacx\\Documents\\GitHub\\Reroll-Items\\python\\Reroll.py";
  HarvestRerollPath =
    "C:\\Users\\shacx\\Documents\\GitHub\\Reroll-Items\\python\\HarvestReroll.py";
} else {
  DocPath = app.getPath("documents");
  ExePath = app.getPath("exe");
  ExePath = ExePath.substring(0, ExePath.lastIndexOf("\\"));
  RerollFolder = path.join(DocPath, "RerollLogs");
  LogFilePath = path.join(RerollFolder, "/Logs.txt");
  LiftKeysPath = path.join(ExePath, "/python/LiftKeys.py");
  RerollPath = path.join(ExePath, "/python/Reroll.py");
  HarvestRerollPath = path.join(ExePath, "/python/HarvestReroll.py");
}

ipcMain.on("StartCrafting", (event, args) => {
  win.webContents.send("Counter", "reset");
  Counter = 0;

  WriteToFile(LogFilePath, "");
  WriteToFile(LogFilePath, "{~~~~~~~~~~~~New Crafting Project~~~~~~~~~~~~");

  let ModName = args[0];
  let MaxRolls = args[1];
  let CurrencyCoords = args[2];
  let TabCoords = args[3];
  let CraftMaterial = args[4];
  let Fracture = args[5];
  let ExclusionMods = args[6];
  let SleepTimer = args[7];
  let ModNumber = args[8];
  WriteToFile(LogFilePath, `ModName: ${ModName}`);
  WriteToFile(LogFilePath, `CraftMaterial: ${CraftMaterial}`);
  if (ExclusionMods.length > 0) {
    WriteToFile(LogFilePath, `ExclusionMods: ${ExclusionMods}`);
  }
  console.log("CraftMaterial: ", CraftMaterial);
  if (CraftMaterial === "Harvest") {
    const HarvestCraft = spawn("python", [
      HarvestRerollPath, //0
      ModName, //1
      MaxRolls, //2
      CurrencyCoords, //3
      TabCoords, //4
      CraftMaterial, //5 useless?
      Fracture, //6
      ExclusionMods, //7
      SleepTimer, //8
      ModNumber, //9
    ]);
    HarvestCraft.stdout.on("data", (data) => {
      let PrintThis = String(data);
      console.log(PrintThis);
      if (PrintThis.includes("MyCounter")) {
        Counter += 1;
        console.log("Counter: ", Counter);
        win.webContents.send("Counter", "+");
      }
      if (PrintThis.includes("InitialBase")) {
        PrintThis = PrintThis.replace("InitialBase", "");
        PrintThis = "----------\n" + PrintThis + "\n----------";
        WriteToFile(LogFilePath, PrintThis);
      }
      if (PrintThis.includes("Matching Line")) {
        WriteToFile(LogFilePath, `MatchLine: ${PrintThis}`);
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
    HarvestCraft.stderr.on("data", (data) => {
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
    HarvestCraft.on("exit", (code, signal) => {
      const LiftKeys = spawn("python", [LiftKeysPath]);
      LiftKeys.stderr.on("data", (data) => {
        console.error("Error with liftkeys: ", String(data));
        WriteToFile(LogFilePath, `${String(data)}`);
      });

      if (code !== null && code !== "0" && code !== 0) {
        console.log(`Crafting script exited with code ${code}`);
        WriteToFile(LogFilePath, `Crafting script exited with code ${code}`);
      } else if (signal !== null) {
        console.log(`Crafting script was killed by signal ${signal}`);
        WriteToFile(
          LogFilePath,
          `Crafting script was killed by signal ${signal}`
        );
      }
      WriteToFile(LogFilePath, `Counter: ${Counter}`);
      WriteToFile(LogFilePath, "~~~~~~~~~~~~Crafting Project End~~~~~~~~~~~~}");
    });
  } else {
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
        Counter += 1;
        win.webContents.send("Counter", "+");
      }
      if (PrintThis.includes("InitialBase")) {
        PrintThis = PrintThis.replace("InitialBase", "");
        PrintThis = "----------\n" + PrintThis + "\n----------";
        WriteToFile(LogFilePath, PrintThis);
      }
      if (PrintThis.includes("Matching Line")) {
        WriteToFile(LogFilePath, `MatchLine: ${PrintThis}`);
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

      if (code !== null && code !== "0" && code !== 0) {
        console.log(`Crafting script exited with code ${code}`);
        WriteToFile(LogFilePath, `Crafting script exited with code ${code}`);
      } else if (signal !== null) {
        console.log(`Crafting script was killed by signal ${signal}`);
        WriteToFile(
          LogFilePath,
          `Crafting script was killed by signal ${signal}`
        );
      }
      WriteToFile(LogFilePath, `Counter: ${Counter}`);
      WriteToFile(LogFilePath, "~~~~~~~~~~~~Crafting Project End~~~~~~~~~~~~}");
    });
  }
});
