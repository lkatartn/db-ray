import { getDefaultConnection } from "@/features/connection/dbConnection";
import type { NextApiHandler } from "next";

export const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    // get database name from path
    const { database } = req.query;
    // get table names and sizes from database
    const conn = await getDefaultConnection();
    if (!conn) {
      res.setHeader("Location", "/connect");
      return res.status(400).send("Redirecting to /connect");
    }
    const result = await conn.raw(
      `
    SELECT
        table_schema,
        table_name
    FROM
        information_schema.tables
    WHERE
     table_catalog = :database
     AND table_schema NOT IN ('pg_catalog', 'information_schema')
    ORDER BY
      table_schema DESC,
      table_name DESC
    LIMIT 100;

    `,
      { database }
    );
    res.status(200).json(result);
  }
  if (req.method === "POST") {
    // create table with given name

    res.status(200).json({ message: "POST" });
  }
};
export default handler;
