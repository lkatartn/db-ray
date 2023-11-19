import {
  getDefaultConnection,
  isConnectionFunctioning,
  setConnection,
} from "../features/connection/dbConnection";
import { Response, Router } from "express";
import { tablesRouter } from "./tables";
import { historyRouter } from "./history";
import { getNameForQuery } from "../features/pro/config";
import {
  addHistoryRecord,
  editHistoryRecordByCreationDate,
} from "../common/appData";
import { proRouter } from "./pro";
import { defaultErrorHandler } from "../common/defaultErrorHandler";

export const rootRouter = Router();

rootRouter.post(
  "/setConnection",
  defaultErrorHandler(async (req, res) => {
    try {
      const { connectionName, connectionConfig } = req.body;

      const conn = await setConnection(connectionName, connectionConfig);
      await conn.raw("SELECT 1");

      res.send("OK");
    } catch (e) {
      console.error(e);
      res
        .status(400)
        .send(
          (e as Error)?.message ||
            JSON.stringify(e as Error) ||
            "Error establishing connection"
        );
    }
  })
);

const getDatabases = async () => {
  const conn = await getDefaultConnection();

  const databases = await conn.raw("SELECT datname FROM pg_database");
  return databases.rows;
};

const redirectToConnect = (res: Response) => {
  res.appendHeader("Location", "/connect");
  return res.status(400).send("Redirecting to /connect");
};

rootRouter.get(
  "/getDatabases",
  defaultErrorHandler(async (req, res) => {
    const conn = await getDefaultConnection();
    if (!conn) {
      return redirectToConnect(res);
    }
    const databases = await getDatabases();
    res.send(databases);
  })
);
rootRouter.get(
  "/isConnectionFunctioning",
  defaultErrorHandler(async (req, res) => {
    const conn = await getDefaultConnection();
    if (!conn) {
      return redirectToConnect(res);
    }
    const isFunctioning = await isConnectionFunctioning("default");
    res.send({ isConnectionFunctioning: isFunctioning });
  })
);

rootRouter.post(
  "/executeQuery",
  defaultErrorHandler(async (req, res) => {
    // get the query from the request body
    const { query, forDatabase } = req.body;
    const conn = await getDefaultConnection();
    if (!conn) {
      return redirectToConnect(res);
    }
    try {
      const autoNamePromise = getNameForQuery(query);
      const result = await conn.raw(query);

      const record = await addHistoryRecord({
        connectionName: "default",
        query,
        forDatabase,
      });
      res.status(200).json(result);
      if (record.name) return;
      let name = undefined;
      try {
        name = await autoNamePromise;
        await editHistoryRecordByCreationDate({
          connectionName: "default",
          createdAt: record.createdAt,
          name,
        });
      } catch (e) {
        // No name can be created for this query
      }
    } catch (e) {
      console.error(e);
      res.status(400);
      res.json(e);
    }
  })
);

rootRouter.use("/tables", tablesRouter);
rootRouter.use("/history", historyRouter);
rootRouter.use("/pro", proRouter);

// 404 fallback
rootRouter.use((req, res) => {
  res.status(404).send("Not found");
});
