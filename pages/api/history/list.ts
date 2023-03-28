import { getHistoryRecords } from "@/common/appData";
import type { NextApiHandler } from "next";

export const handler: NextApiHandler = async (req, res) => {
  // get the connection from query string
  const { connection } = req.query;
  try {
    const result = await getHistoryRecords((connection as string) ?? "default");

    res.status(200).json(result);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};
export default handler;
