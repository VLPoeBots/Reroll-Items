import { exec } from "child_process";
import { WriteToFile } from "./LogFiles.js";
export function CheckPyPackage(PackageName, LogFilePath) {
  exec(`pip show ${PackageName}`, (error, stdout, stderr) => {
    if (error || stderr) {
      WriteToFile(LogFilePath, `${PackageName} not found`);
      if (
        error.includes("WARNING: Package(s) not found:") ||
        stderr.includes("WARNING: Package(s) not found:")
      ) {
        WriteToFile(LogFilePath, `attempting to install ${PackageName}... `);
        InstallPyPackage(PackageName, LogFilePath);
      }
      return;
    }
    if (stdout.includes("Version")) {
      WriteToFile(LogFilePath, `${PackageName} is already installed`);
    }
  });
}
function InstallPyPackage(PackageName, Logfile) {
  exec(
    `pip install ${PackageName}`,
    (installError, installStdout, installStderr) => {
      if (installError || installStderr) {
        WriteToFile(
          Logfile,
          `Error installing ${PackageName}: ${installError || installStderr}`
        );
      } else {
        WriteToFile(Logfile, `${PackageName} has been installed successfully`);
      }
    }
  );
}
export function CheckPython(LogFilePath) {
  exec("python --version", (error, stdout, stderr) => {
    if (error) {
      WriteToFile(LogFilePath, error);
      return;
    }

    console.log(`Python is installed: ${stdout || stderr}`);
    WriteToFile(LogFilePath, `Python is installed: ${stdout || stderr}`);
  });
}
