import {
  addHistoryRecord,
  editHistoryRecordByCreationDate,
} from "@/common/appData";
import { getDefaultConnection } from "@/features/connection/dbConnection";
import { getNameForQuery } from "@/features/pro/config";
import type { NextApiHandler } from "next";

export const handler: NextApiHandler = async (req, res) => {
  // get the query from the request body
  const { query, forDatabase } = req.body;
  const conn = await getDefaultConnection();
  if (!conn) {
    res.setHeader("Location", "/connect");
    return res.status(400).send("Redirecting to /connect");
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
};
export default handler;
