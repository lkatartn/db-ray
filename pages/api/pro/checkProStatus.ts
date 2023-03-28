import { getApiKey } from "@/common/appData";
import { checkAPIKey } from "@/features/pro/config";
import { NextApiRequest, NextApiResponse } from "next";

export type ProApiKeyStatus = "active" | "not active" | "not exist";

export const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<{ status: ProApiKeyStatus }>
) => {
  try {
    const result = await getApiKey();

    // check API key status
    if (result === null) {
      res.status(200).json({ status: "not exist" });
      return;
    }

    const isAPIKeyActive = await checkAPIKey();

    if (isAPIKeyActive) {
      res.status(200).json({ status: "active" });
      return;
    }

    res.status(200).json({ status: "not active" });
    return;
  } catch (e) {
    // @ts-ignore
    res.status(400).send(e);
  }
};

export default handler;
