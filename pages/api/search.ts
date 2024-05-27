import configuration from "@/app/configuration";
import { NextApiRequest, NextApiResponse } from "next";

import httpProxyMiddleware from "next-http-proxy-middleware";

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!configuration.searchEndpoint) {
    return res.status(404).send(null);
  }

  await httpProxyMiddleware(req, res, {
    pathRewrite: [
      {
        patternStr: "^/api/search",
        replaceStr: "",
      },
    ],
    target: configuration.searchEndpoint!,
  });
}
