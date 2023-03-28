import { addHistoryRecord } from "@/common/appData";
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
    const result = await conn.raw(query);
    await addHistoryRecord({
      connectionName: "default",
      query,
      forDatabase,
    });
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(400);
    res.json(e);
  }
};
export default handler;
