import {
  addHistoryRecord,
  HistoryRecord,
  getHistoryRecords,
  deleteHistoryRecordByCreationDate,
  editHistoryRecordByCreationDate,
} from "../common/appData";
import { Router } from "express";
import { defaultErrorHandler } from "../common/defaultErrorHandler";

export const historyRouter = Router();

historyRouter.get(
  "/list",
  defaultErrorHandler(async (req, res) => {
    // get the connection from query string
    const connection = req.query.connection as string;
    const result = await getHistoryRecords((connection as string) ?? "default");
    res.send(result);
  })
);

historyRouter.post(
  "/add",
  defaultErrorHandler(async (req, res) => {
    // Get data from request body
    const { connection, query, name, forDatabase } = req.body;
    const result = await addHistoryRecord({
      connectionName: connection ?? "default",
      query,
      name: name ?? "Untitled",
      forDatabase,
    });
    res.send(result);
  })
);
historyRouter.post(
  "/delete",
  defaultErrorHandler(async (req, res) => {
    // Get data from request body
    const { connection, createdAt } = req.body;
    const result = await deleteHistoryRecordByCreationDate({
      connectionName: connection ?? "default",
      createdAt,
    });
    res.send(result);
  })
);

historyRouter.post(
  "/edit",
  defaultErrorHandler(async (req, res) => {
    // Get data from request body
    const { connection, createdAt, ...otherFields } = req.body;
    const result = await editHistoryRecordByCreationDate({
      connectionName: connection ?? "default",
      createdAt,
      ...otherFields,
    });
    res.send(result);
  })
);
