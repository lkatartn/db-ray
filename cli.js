#!/usr/bin/env node

const { spawn, exec } = require("child_process");
// const path = require("path");
// const os = require("os");
// const nextBinaryFileName = os.platform() === "win32" ? "next.cmd" : "next";
// const nextBinary = path.join(
//   __dirname,
//   "node_modules",
//   ".bin",
//   nextBinaryFileName
// );
process.argv.push("start", "-H", "127.0.0.1", "-p", 3011);

//set current path to be the path of script
process.chdir(__dirname);

const next = require("next/dist/bin/next");

// nextProcess.on("error", (error) => {
//   console.error("Failed to start DB-RAY server:", error);
// });

// nextProcess.on("exit", (code, signal) => {
//   if (code) {
//     console.error(`DB-RAY server exited with code ${code}`);
//   } else if (signal) {
//     console.error(`DB-RAY server exited due to signal ${signal}`);
//   } else {
//     console.log("DB-RAY server exited");
//   }
// });

// if process started successfully  open a browser
openURL("http://localhost:3011");

function openURL(url) {
  switch (process.platform) {
    case "darwin":
      exec(`open ${url}`);
      break;
    case "win32":
      exec(`start ${url}`);
      break;
    case "linux":
      exec(`xdg-open ${url}`);
      break;
    default:
      console.error("Unsupported platform:", process.platform);
  }
}
