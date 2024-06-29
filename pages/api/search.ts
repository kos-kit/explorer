import configuration from "@/app/configuration";
import { NextApiRequest, NextApiResponse } from "next";
import httpProxyMiddleware from "next-http-proxy-middleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!configuration.searchEndpoint) {
    res.status(404).send(null);
    return;
  }

  await httpProxyMiddleware(req, res, {
    pathRewrite: [
      {
        patternStr: "^/api/search",
        replaceStr: "",
      },
    ],
    target: configuration.searchEndpoint,
  });
}

export const config = {
  api: {
    externalResolver: true,
  },
};
