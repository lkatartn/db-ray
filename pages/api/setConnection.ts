import { setConnection } from "@/features/connection/dbConnection";
import type { NextApiHandler } from "next";

export const handler: NextApiHandler = async (req, res) => {
  const { connectionName, connectionConfig } = req.body;

  const conn = await setConnection(connectionName, connectionConfig);
  try {
    await conn.raw("SELECT 1");
    res.status(200);
    res.end();
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};
export default handler;
