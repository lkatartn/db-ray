import { getApiKey } from "../common/appData";
import { defaultErrorHandler } from "../common/defaultErrorHandler";
import { getTablesStructureContextForDatabase } from "../features/connection/getContextForDatabase";
import {
  checkAPIKey,
  getSQLQueryFromPrompt,
  getSQLQueryFromPromptWithContext,
  tokenStorage,
} from "../features/pro/config";
import { Router } from "express";

export type ProApiKeyStatus = "active" | "not active" | "not exist";

export const proRouter = Router();

const handleRequest = ({ token }: { token?: unknown }) => {
  if (token && typeof token === "string") {
    tokenStorage.set(token);
  }
};
proRouter.post(
  "/saveToken",
  defaultErrorHandler(async (req, res) => {
    //take the token from the query string
    const token = req.query.token;
    handleRequest({ token });

    res.redirect(302, "/");
  })
);

proRouter.post(
  "/plainPrompt",
  defaultErrorHandler(async (req, res) => {
    // get the query from the request body
    const { prompt, databaseName } = req.body;
    try {
      let result;
      if (!databaseName) {
        result = await getSQLQueryFromPrompt(prompt);
      } else {
        const context = await getTablesStructureContextForDatabase(
          databaseName
        );
        result = await getSQLQueryFromPromptWithContext(prompt, {
          databaseName,
          tables: context,
        });
      }

      res.status(200).json({ query: result });
    } catch (e) {
      console.error(e);
      res.status(400);
      res.json(e);
    }
  })
);

proRouter.get(
  "/checkProStatus",
  defaultErrorHandler(async (req, res) => {
    try {
      const result = await getApiKey();

      // check API key status
      if (result === null) {
        res.status(200).json({ status: "not exist" });
        return;
      }

      const isAPIKeyActive = await checkAPIKey();

      if (isAPIKeyActive) {
        res.status(200).json({ status: "active" });
        return;
      }

      res.status(200).json({ status: "not active" });
      return;
    } catch (e) {
      // @ts-ignore
      res.status(400).send(e);
    }
  })
);
