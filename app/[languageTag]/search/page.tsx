import path from "node:path";
import fs from "node:fs/promises";
import { SearchPage as SearchPageClient } from "@/lib/components/SearchPage";
import configuration from "@/app/configuration";
import kosFactory from "@/app/kosFactory";
import { Layout } from "@/lib/components/Layout";
import { Metadata } from "next";
import { PageMetadata } from "@/app/PageMetadata";
import { LanguageTag } from "@kos-kit/models";
import {
  SearchEngineJson,
  LunrSearchEngine,
  ServerSearchEngine,
} from "@kos-kit/search";

interface SearchPageParams {
  languageTag: LanguageTag;
}

async function getLunrSearchEngineJson({
  languageTag,
}: {
  languageTag: LanguageTag;
}): Promise<SearchEngineJson> {
  const searchEngineJsonDirPath = path.join(
    configuration.cacheDirectoryPath,
    "search-engine",
  );

  const searchEngineJsonFilePath = path.join(
    searchEngineJsonDirPath,
    `${languageTag}.json`,
  );

  let searchEngineJsonFileContents: Buffer | undefined;
  try {
    searchEngineJsonFileContents = await fs.readFile(searchEngineJsonFilePath);
  } catch {
    /* empty */
  }

  let searchEngineJson: SearchEngineJson;
  if (searchEngineJsonFileContents) {
    searchEngineJson = JSON.parse(searchEngineJsonFileContents.toString());
  } else {
    console.info("creating", languageTag, "search engine");
    const searchEngine = await LunrSearchEngine.create({
      languageTag,
      kos: kosFactory({ languageTag: languageTag }),
    });
    console.info("created", languageTag, "search engine");

    const searchEngineJsonString = JSON.stringify(searchEngine.toJson());
    searchEngineJson = JSON.parse(searchEngineJsonString);

    console.info(
      "writing",
      languageTag,
      "search engine JSON to",
      searchEngineJsonFilePath,
    );
    await fs.mkdir(searchEngineJsonDirPath, { recursive: true });
    await fs.writeFile(searchEngineJsonFilePath, searchEngineJsonString);
    console.info(
      "wrote",
      languageTag,
      "search engine JSON to",
      searchEngineJsonFilePath,
    );
  }

  return searchEngineJson;
}

async function getSearchEngineJson({
  languageTag,
}: {
  languageTag: LanguageTag;
}): Promise<SearchEngineJson> {
  if (configuration.dataFilePaths.length > 0) {
    return getLunrSearchEngineJson({ languageTag });
  } else if (configuration.searchEndpoint !== null) {
    return getServerSearchEngineJson({
      searchEndpoint: configuration.dynamic
        ? "/api/search"
        : configuration.searchEndpoint,
    });
  } else {
    return Promise.reject(
      new Error("must specify data paths or search endpoint in configuration"),
    );
  }
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
  params: { languageTag },
}: {
  params: SearchPageParams;
}) {
  return (
    <Layout languageTag={languageTag}>
      <SearchPageClient
        configuration={configuration}
        languageTag={languageTag}
        searchEngineJson={await getSearchEngineJson({ languageTag })}
      />
    </Layout>
  );
}

export async function generateMetadata({
  params: { languageTag },
}: {
  params: SearchPageParams;
}): Promise<Metadata> {
  return new PageMetadata({ languageTag }).search();
}

export async function generateStaticParams(): Promise<SearchPageParams[]> {
  if (configuration.dynamic) {
    return [];
  }

  return configuration.languageTags.map((languageTag) => ({
    languageTag,
  }));
}
