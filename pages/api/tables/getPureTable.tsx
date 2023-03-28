import { getDefaultConnection } from "@/features/connection/dbConnection";
import type { NextApiHandler } from "next";

export const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    // get table name from queryString
    const table = req.query.table;
    const schema = req.query.schema;
    const conn = await getDefaultConnection();

    const result = await conn.raw(
      `
    SELECT
        *
    FROM 
       ${schema}.${table}
    LIMIT 1000;
    `
    );
    res.status(200).json(result);
  } else {
    res.status(400).json({ error: "Bad request" });
  }
};
export default handler;
