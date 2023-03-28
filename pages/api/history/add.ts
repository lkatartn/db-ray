import { addHistoryRecord, HistoryRecord } from "@/common/appData";
import type { NextApiHandler } from "next";

export const handler: NextApiHandler = async (req, res) => {
  // Get data from request body
  const { connection, query, name, forDatabase } = req.body;
  try {
    const result = await addHistoryRecord({
      connectionName: connection ?? "default",
      query,
      name: name ?? "Untitled",
      forDatabase,
    });
    res.status(200).json(result);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};
export default handler;
