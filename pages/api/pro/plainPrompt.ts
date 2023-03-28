import { getTablesStructureContextForDatabase } from "@/features/connection/getContextForDatabase";
import {
  getSQLQueryFromPrompt,
  getSQLQueryFromPromptWithContext,
} from "@/features/pro/config";
import type { NextApiHandler } from "next";

export const handler: NextApiHandler = async (req, res) => {
  // get the query from the request body
  const { prompt, databaseName } = req.body;
  try {
    let result;
    if (!databaseName) {
      result = await getSQLQueryFromPrompt(prompt);
    } else {
      const context = await getTablesStructureContextForDatabase(databaseName);
      result = await getSQLQueryFromPromptWithContext(prompt, {
        databaseName,
        tables: context,
      });
    }

    res.status(200).json({ query: result });
  } catch (e) {
    console.error(e);
    res.status(400);
    res.json(e);
  }
};
export default handler;
