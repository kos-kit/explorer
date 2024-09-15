import fs from "node:fs/promises";
import path from "node:path";
import { PageMetadata } from "@/app/PageMetadata";
import { configuration } from "@/app/configuration";
import { kosFactory } from "@/app/kosFactory";
import { Layout } from "@/lib/components/Layout";
import { SearchPage as SearchPageClient } from "@/lib/components/SearchPage";
import { Locale } from "@/lib/models";
import {
  LunrSearchEngine,
  SearchEngineJson,
  ServerSearchEngine,
} from "@kos-kit/search";
import { Metadata } from "next";
import { getMessages, unstable_setRequestLocale } from "next-intl/server";

interface SearchPageParams {
  locale: Locale;
}

async function getLunrSearchEngineJson({
  locale,
}: {
  locale: Locale;
}): Promise<SearchEngineJson> {
  const searchEngineJsonDirPath = path.join(
    configuration.cacheDirectoryPath,
    "search-engine",
  );

  const searchEngineJsonFilePath = path.join(
    searchEngineJsonDirPath,
    `${locale}.json`,
  );

  let searchEngineJsonFileContents: Buffer | undefined;
  try {
    searchEngineJsonFileContents = await fs.readFile(searchEngineJsonFilePath);
  } catch {
    /* empty */
  }

  let searchEngineJson: SearchEngineJson;
  if (searchEngineJsonFileContents) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    searchEngineJson = JSON.parse(searchEngineJsonFileContents.toString());
  } else {
    console.info("creating", locale, "search engine");
    const searchEngine = await LunrSearchEngine.create({
      languageTag: locale,
      kos: await kosFactory({ locale }),
    });
    console.info("created", locale, "search engine");

    const searchEngineJsonString = JSON.stringify(searchEngine.toJson());
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    searchEngineJson = JSON.parse(searchEngineJsonString);

    console.info(
      "writing",
      locale,
      "search engine JSON to",
      searchEngineJsonFilePath,
    );
    await fs.mkdir(searchEngineJsonDirPath, { recursive: true });
    await fs.writeFile(searchEngineJsonFilePath, searchEngineJsonString);
    console.info(
      "wrote",
      locale,
      "search engine JSON to",
      searchEngineJsonFilePath,
    );
  }

  return searchEngineJson;
}

async function getSearchEngineJson({
  locale,
}: {
  locale: Locale;
}): Promise<SearchEngineJson> {
  if (configuration.dataPaths.length > 0) {
    return getLunrSearchEngineJson({ locale });
  }
  if (configuration.searchEndpoint !== null) {
    return getServerSearchEngineJson({
      searchEndpoint: configuration.dynamic
        ? "/api/search"
        : configuration.searchEndpoint,
    });
  }
  return Promise.reject(
    new Error("must specify data paths or search endpoint in configuration"),
  );
}

async function getServerSearchEngineJson({
  searchEndpoint,
}: {
  searchEndpoint: string;
}): Promise<SearchEngineJson> {
  // console.info("using search endpoint", searchEndpoint);
  return Promise.resolve(new ServerSearchEngine(searchEndpoint).toJson());
}

export default async function SearchPage({
  params: { locale },
}: {
  params: SearchPageParams;
}) {
  unstable_setRequestLocale(locale);

  return (
    <Layout>
      <SearchPageClient
        configuration={{
          conceptsPerPage: configuration.conceptsPerPage,
          nextBasePath: configuration.nextBasePath,
        }}
        locale={locale}
        messages={await getMessages()}
        searchEngineJson={await getSearchEngineJson({ locale })}
      />
    </Layout>
  );
}

export async function generateMetadata({
  params: { locale },
}: {
  params: SearchPageParams;
}): Promise<Metadata> {
  return new PageMetadata({ locale }).search();
}

export function generateStaticParams(): SearchPageParams[] {
  if (configuration.dynamic) {
    return [];
  }

  return configuration.locales.map((locale) => ({
    locale,
  }));
}
