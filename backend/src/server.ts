import express, { Express } from "express";
import path from "path";
import { exec } from "child_process";
import bodyParser from "body-parser";
import { program } from "commander";
import { setConnection } from "./features/connection/dbConnection";
import { rootRouter } from "./api/root";
import { createProxyMiddleware } from "http-proxy-middleware";

const jsonParser = bodyParser.json();

program
  .version("0.2.8")
  .option("-h, --host <type>", "Host name")
  .option("-p, --port <type>", "Port number")
  .option("-U, --username <type>", "Username")
  .option("-d, --dbname <type>", "Database name")
  .option("-W, --password <type>", "Password")
  .parse(process.argv);

const options = program.opts();

const app: Express = express();
const port = 3011;
const development = process.env.NODE_ENV === "development";

const VitePort = 5173;

app.use("/api", jsonParser, rootRouter);

if (development) {
  console.log("🚧 ".repeat(12));
  console.log("App is running in development mode");
  console.log("🚧 ".repeat(12));

  const wsProxy = createProxyMiddleware("/", {
    target: `http://localhost:${VitePort}/`,

    ws: true, // enable websocket proxy
  });

  app.use(wsProxy);
} else {
  const staticParams = {
    etag: false,
    setHeaders: (res: express.Response, path: string, stat: any) => {
      res.set("Cache-Control", "no-store");
    },
  };
  app.use("/public", express.static("../../public", staticParams));
  app.use(express.static(path.join(__dirname, "../../dist"), staticParams));
  app.use("*", (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, "../../dist", "index.html"));
  });
}

app.listen(port, "127.0.0.1", () => {
  console.log(`⚡️[server]: Server is running at http://127.0.0.1:${port}`);
});

// Connect automatically if all parameters are provided
if (
  [
    options.host,
    options.port,
    options.username,
    options.dbname || "postgres",
    options.password,
  ].every((param) => param !== undefined)
) {
  setConnection("default", {
    host: options.host,
    port: parseInt(options.port!),
    user: process.env.DB_PARAM_USERNAME,
    password: options.password,
    database: options.dbname,
  });
  openURL("http://localhost:3011" + (options.dbname || "postgres"));
} else {
  if (!development) openURL("http://localhost:3011/connect");
}

function openURL(url: string) {
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
