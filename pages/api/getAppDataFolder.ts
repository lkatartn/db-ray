import type { NextApiHandler } from "next";
import { getAppDataFolder } from "@/common/appData";

export const handler: NextApiHandler = async (req, res) => {
  const folder = await getAppDataFolder();
  res.status(200).json(folder);
};
export default handler;
