import modelSet from "@/app/modelSet";
import { SearchEngineType } from "@/lib/search/SearchEngineType";
import { LanguageTag } from "@/lib/models/LanguageTag";
import path from "node:path";
import fs from "node:fs/promises";
import { SearchEngine } from "@/lib/search/SearchEngine";
import { createSearchEngineFromJson } from "@/lib/search/createSearchEngineFromJson";
import { LunrSearchEngine } from "@/lib/search/LunrSearchEngine";
import { SearchPage as SearchPageClient } from "@/lib/components/SearchPage";
import configuration from "@/app/configuration";

interface SearchPageParams {
  languageTag: LanguageTag;
  searchEngineJson: { [index: string]: any; type: SearchEngineType };
}

export default function SearchPage({
  languageTag,
  searchEngineJson,
}: SearchPageParams) {
  return (
    <SearchPageClient
      languageTag={languageTag}
      searchEngineJson={searchEngineJson}
    />
  );
}

export async function generateStaticParams(): Promise<SearchPageParams[]> {
  const staticParams: SearchPageParams[] = [];

  const cacheDirPath = path.join(
    configuration.cacheDirectoryPath,
    "search-engine",
  );
  await fs.mkdir(cacheDirPath, { recursive: true });

  for (const languageTag of await modelSet.languageTags()) {
    const searchEngineJsonFilePath = path.join(
      cacheDirPath,
      `${languageTag}.json`,
    );

    let searchEngineJsonFileContents: Buffer | undefined;
    try {
      searchEngineJsonFileContents = await fs.readFile(
        searchEngineJsonFilePath,
      );
    } catch {
      /* empty */
    }

    let searchEngine: SearchEngine;
    if (searchEngineJsonFileContents) {
      console.debug(
        "recreating",
        languageTag,
        "search engine from JSON at",
        searchEngineJsonFilePath,
      );
      searchEngine = createSearchEngineFromJson(
        JSON.parse(searchEngineJsonFileContents.toString()),
      );
      console.debug(
        "recreated",
        languageTag,
        "search engine from JSON at",
        searchEngineJsonFilePath,
      );
    } else {
      console.info("creating", languageTag, "search engine");
      searchEngine = await LunrSearchEngine.create({ languageTag, modelSet });
      console.info("created", languageTag, "search engine");
      console.info(
        "writing",
        languageTag,
        "search engine JSON to",
        searchEngineJsonFilePath,
      );
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
    }

    staticParams.push({
      searchEngineJson: searchEngine.toJson(),
      languageTag,
    });
  }

  return staticParams;
}
