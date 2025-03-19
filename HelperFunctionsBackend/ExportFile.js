import { ipcMain } from "electron";
import { win } from "../main.js";
import { WriteToFile, CheckFileExistence } from "./LogFiles.js";

ipcMain.on("ReturnExportData", (event, data) => {
  let FileExists = CheckFileExistence(data[2]);
  if (!FileExists) {
    ExportItemToFile(data[0], data[1], data[2]);
  } else {
    //Doesnt work yet !!!

    win.webContents.send("ExportItem", "NamingError");
    console.log("Some error..");
  }
});

/**
 *
 * @param {Array<string>} Pmods
 * @param {Array<string>} Nmods
 * @param {string} FilePath
 */
function ExportItemToFile(Pmods, Nmods, FilePath) {
  for (let i = 0; i < Pmods.length; i++) {
    WriteToFile(FilePath, Pmods[i]);
  }
  WriteToFile(FilePath, "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  for (let i = 0; i < Nmods.length; i++) {
    WriteToFile(FilePath, Nmods[i]);
  }
}
