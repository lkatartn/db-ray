import {
  editHistoryRecordByCreationDate,
  HistoryRecord,
} from "@/common/appData";
import type { NextApiHandler } from "next";

export const handler: NextApiHandler = async (req, res) => {
  // Get data from request body
  const { connection, createdAt, ...otherFields } = req.body;
  try {
    const result = await editHistoryRecordByCreationDate({
      connectionName: connection ?? "default",
      createdAt,
      ...otherFields,
    });
    res.status(200).json(result);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};
export default handler;
