#!/usr/bin/env node

const { spawn, exec } = require("child_process");
const { program } = require("commander");

program
  .version("0.2.8")
  .option("-h, --host <type>", "Host name")
  .option("-p, --port <type>", "Port number")
  .option("-U, --username <type>", "Username")
  .option("-d, --dbname <type>", "Database name")
  .option("-W, --password <type>", "Password")
  .parse(process.argv);

const options = program.opts();
// const path = require("path");
// const os = require("os");
// const nextBinaryFileName = os.platform() === "win32" ? "next.cmd" : "next";
// const nextBinary = path.join(
//   __dirname,
//   "node_modules",
//   ".bin",
//   nextBinaryFileName
// );

// Clear the original parameters and substitute with new ones
process.argv.splice(2);
process.argv.push("start", "-H", "127.0.0.1", "-p", 3011);

//set current path to be the path of script
process.chdir(__dirname);
options.host && (process.env.DB_PARAM_HOST = options.host);
options.port && (process.env.DB_PARAM_PORT = options.port);
options.username && (process.env.DB_PARAM_USERNAME = options.username);
options.dbname && (process.env.DB_PARAM_DBNAME = options.dbname);
options.password && (process.env.DB_PARAM_PASSWORD = options.password);

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
openURL("http://localhost:3011" + options.dbname ? "/" + options.dbname : "");

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
