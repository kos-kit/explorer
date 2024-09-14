import { configuration } from "@/app/configuration";
import { Hrefs } from "@/lib/Hrefs";
import { getLocale } from "next-intl/server";

/**
 * Get an Hrefs instance on the server.
 */
export async function getHrefs(): Promise<Hrefs> {
  return new Hrefs({
    locale: await getLocale(),
    nextBasePath: configuration.nextBasePath,
  });
}
