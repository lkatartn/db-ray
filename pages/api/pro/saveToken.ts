import { tokenStorage } from "@/features/pro/config";

import { NextApiRequest, NextApiResponse } from "next";

const handleRequest = ({ token }: { token?: unknown }) => {
  if (token && typeof token === "string") {
    tokenStorage.set(token);
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  //take the token from the query string
  const token = req.query.token;
  handleRequest({ token });

  res.redirect(302, "/");
}
