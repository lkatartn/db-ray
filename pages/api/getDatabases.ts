import { getDefaultConnection } from "../../features/connection/dbConnection";
import type { NextApiHandler } from "next";

export const getDatabases = async () => {
  const conn = await getDefaultConnection();

  const databases = await conn.raw("SELECT datname FROM pg_database");
  return databases.rows;
};

export const handler: NextApiHandler = async (req, res) => {
  const conn = await getDefaultConnection();
  if (!conn) {
    res.setHeader("Location", "/connect");
    return res.status(400).send("Redirecting to /connect");
  }
  const databases = await getDatabases();
  res.status(200).json(databases);
};
export default handler;
