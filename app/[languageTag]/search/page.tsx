import modelSet from "@/app/modelSet";
import { SearchEngineType } from "@/lib/search/SearchEngineType";
import { LanguageTag } from "@/lib/models/LanguageTag";
import path from "node:path";
import fs from "node:fs/promises";
import { SearchEngine } from "@/lib/search/SearchEngine";
import { createSearchEngineFromJson } from "@/lib/search/createSearchEngineFromJson";
import { LunrSearchEngine } from "@/lib/search/LunrSearchEngine";
import { SearchPage as SearchPageClient } from "@/lib/components/SearchPage";

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
  const searchEngineJsonFilePath = path.resolve("search-engine.json");

  let searchEngineJsonFileContents: Buffer | undefined;
  try {
    searchEngineJsonFileContents = await fs.readFile(searchEngineJsonFilePath);
  } catch {
    /* empty */
  }

  let searchEngine: SearchEngine;
  if (searchEngineJsonFileContents) {
    console.debug(
      "recreating search engine from JSON at",
      searchEngineJsonFilePath,
    );
    searchEngine = createSearchEngineFromJson(
      JSON.parse(searchEngineJsonFileContents.toString()),
    );
    console.debug(
      "recreated search engine from JSON at",
      searchEngineJsonFilePath,
    );
  } else {
    console.info("creating search engine");
    searchEngine = await LunrSearchEngine.create(modelSet);
    console.info("created search engine");
    console.info("writing search engine JSON to", searchEngineJsonFilePath);
    await fs.writeFile(
      searchEngineJsonFilePath,
      JSON.stringify(searchEngine.toJson()),
    );
    console.info("wrote search engine JSON to", searchEngineJsonFilePath);
  }

  const searchEngineJson = searchEngine.toJson(); // TODO: limit this to the languageTag?

  return (await modelSet.languageTags()).map((languageTag) => ({
    languageTag,
    searchEngineJson,
  }));
}
