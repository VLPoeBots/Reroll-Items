import fs from "fs";
import { exec } from "child_process";

export function WriteToFile(FilePath, StringToWrite) {
  fs.appendFileSync(FilePath, StringToWrite + "\n");
}

export function CreateLogFolder(FolderPath, DocPath) {
  if (!fs.existsSync(FolderPath)) {
    fs.mkdirSync(FolderPath, { recursive: true });
  }
}

export function OpenFile(FilePath) {
  exec(`start "" "${FilePath}"`);
}

export function DeleteFileContent(FilePath) {
  fs.writeFileSync(FilePath, "");
}

export function CheckFileExistence(FilePath) {
  return fs.existsSync(FilePath);
}

export function LoadItem(Item) {
  let LineArray = Item.split("\n");
  LineArray = LineArray.filter((item) => item !== "");
  let SplitIndex = LineArray.indexOf(
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
  );
  let Pmods = LineArray.slice(0, SplitIndex);
  let Nmods = LineArray.slice(SplitIndex + 1);
  return [Pmods, Nmods];
}

/**
 *
 * @param {string} LogfilePath
 * @param {string} FolderPath
 * @returns
 */
export async function ReadFolder(LogfilePath, FolderPath) {
  return new Promise((resolve, reject) => {
    console.log("FolderPath: ", FolderPath);
    fs.readdir(FolderPath, (err, files) => {
      if (err) {
        WriteToFile(LogfilePath, `Error reading SaveIcons folder:  ${err}`);
        reject(err);
      } else {
        let ImageExtentions = ["jpg", "png", "jpeg"];
        let ImageFiles = files.filter((file) => {
          const ext = ImageExtentions.includes(
            file.split(".").pop()?.toLowerCase()
          );
          return ext;
        });
        WriteToFile(LogfilePath, `AllFiles: ${files}`);
        WriteToFile(LogfilePath, `ImageFiles:  ${ImageFiles}`);
        resolve(ImageFiles);
      }
    });
  });
}
