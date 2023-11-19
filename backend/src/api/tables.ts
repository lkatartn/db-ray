import { defaultErrorHandler } from "../common/defaultErrorHandler";
import { getDefaultConnection } from "../features/connection/dbConnection";
import { Router } from "express";

export const tablesRouter = Router();

tablesRouter.get(
  "/getPureTable",
  defaultErrorHandler(async (req, res) => {
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
  })
);

tablesRouter.get(
  "/:database",
  defaultErrorHandler(async (req, res) => {
    // get database name from path
    const { database } = req.params;
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
    res.send(result);
  })
);
