import { spawn } from "child_process";
let GHToken = process.env.GH_TOKEN;
console.log("GHToken: ", GHToken);
let PowerShell = spawn("powershell.exe", [
  "-NoProfile",
  "-Command",
  `$env:GH_TOKEN='${GHToken}'; echo 'GH_TOKEN set in PowerShell'`,
]);

PowerShell.stdout.on("data", (data) => {
  console.log(`PowerShell Output: ${data}`);
});

PowerShell.stderr.on("data", (data) => {
  console.error(`PowerShell Error: ${data}`);
});
