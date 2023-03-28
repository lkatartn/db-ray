import { deleteHistoryRecordByCreationDate } from "@/common/appData";
import type { NextApiHandler } from "next";

export const handler: NextApiHandler = async (req, res) => {
  // Get data from request body
  const { connection, createdAt } = req.body;
  try {
    const result = await deleteHistoryRecordByCreationDate({
      connectionName: connection ?? "default",
      createdAt,
    });
    res.status(200).json(result);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};
export default handler;
