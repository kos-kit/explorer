import modelSet from "@/app/modelSet";
import { LanguageTag } from "@/lib/models/LanguageTag";
import path from "node:path";
import fs from "node:fs/promises";
import { SearchEngine } from "@/lib/search/SearchEngine";
import { createSearchEngineFromJson } from "@/lib/search/createSearchEngineFromJson";
import { LunrSearchEngine } from "@/lib/search/LunrSearchEngine";
import { SearchPage as SearchPageClient } from "@/lib/components/SearchPage";
import configuration from "@/app/configuration";
import { Layout } from "@/lib/components/Layout";
import { Metadata } from "next";
import { PageMetadata } from "@/app/PageMetadata";

async function getSearchEngine({
  languageTag,
}: {
  languageTag: LanguageTag;
}): Promise<SearchEngine> {
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

  if (searchEngineJsonFileContents) {
    console.debug(
      "recreating",
      languageTag,
      "search engine from JSON at",
      searchEngineJsonFilePath,
    );
    const searchEngine = createSearchEngineFromJson(
      JSON.parse(searchEngineJsonFileContents.toString()),
    );
    console.debug(
      "recreated",
      languageTag,
      "search engine from JSON at",
      searchEngineJsonFilePath,
    );
    return searchEngine;
  }

  console.info("creating", languageTag, "search engine");
  const searchEngine = await LunrSearchEngine.create({ languageTag, modelSet });
  console.info("created", languageTag, "search engine");
  console.info(
    "writing",
    languageTag,
    "search engine JSON to",
    searchEngineJsonFilePath,
  );
  await fs.mkdir(searchEngineJsonDirPath, { recursive: true });
  await fs.writeFile(
    searchEngineJsonFilePath,
    JSON.stringify(searchEngine.toJson()),
  );
  console.info(
    "wrote",
    languageTag,
    "search engine JSON to",
    searchEngineJsonFilePath,
  );
  return searchEngine;
}

interface SearchPageParams {
  languageTag: LanguageTag;
}

export default async function SearchPage({
  params: { languageTag },
}: {
  params: SearchPageParams;
}) {
  return (
    <Layout languageTag={languageTag}>
      <SearchPageClient
        languageTag={languageTag}
        resultsPerPage={configuration.conceptsPerPage}
        searchEngineJson={(await getSearchEngine({ languageTag })).toJson()}
      />
    </Layout>
  );
}

export async function generateMetadata({
  params: { languageTag },
}: {
  params: SearchPageParams;
}): Promise<Metadata> {
  return PageMetadata.search({
    languageTag,
  });
}

export async function generateStaticParams(): Promise<SearchPageParams[]> {
  return (await modelSet.languageTags()).map((languageTag) => ({
    languageTag,
  }));
}
