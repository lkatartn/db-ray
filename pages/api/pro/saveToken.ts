import { DOMAIN, tokenStorage } from "@/features/pro/config";
import { NextApiRequest, NextApiResponse } from "next";

const handleRequest = ({
  token,
  referer,
}: {
  token?: unknown;
  referer?: string;
}) => {
  if (!referer) return;
  const actualRefererHost = new URL(referer).host;
  const refererProtocol = new URL(referer).protocol;
  const desiredRefererHost = new URL(DOMAIN).host;

  if (token && typeof token === "string") {
    tokenStorage.set(token);
  }

  // if the referer is not from the same domain or the protocol is not https
  console.log("actualRefererHost", actualRefererHost);
  console.log("desiredRefererHost", desiredRefererHost);
  console.log("refererProtocol", refererProtocol);
  if (actualRefererHost !== desiredRefererHost || refererProtocol !== "https:")
    return;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  //take the token from the query string
  const token = req.query.token;
  // get the refferer from the request headers
  const referer = req.headers.referer;

  handleRequest({ token, referer });

  res.redirect(302, "/");
}
