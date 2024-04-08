"use client";

import { SearchEngineType } from "@/lib/search/SearchEngineType";
import { createSearchEngineFromJson } from "@/lib/search/createSearchEngineFromJson";
import { Select } from "@/lib/components/Select";
import { useCallback, useMemo } from "react";
import { SearchResult } from "@/lib/search/SearchResult";
import { LanguageTag } from "@/lib/models/LanguageTag";

export function SearchBox({
  languageTag,
  searchEngineJson,
}: {
  languageTag: LanguageTag;
  searchEngineJson: { [index: string]: any; type: SearchEngineType };
}) {
  const searchEngine = useMemo(
    () => createSearchEngineFromJson(searchEngineJson),
    [searchEngineJson],
  );

  const loadOptions = useCallback(
    (inputValue: string) =>
      searchEngine.search({
        languageTag,
        limit: 10,
        offset: 0,
        query: inputValue,
      }),
    [languageTag, searchEngine],
  );

  return (
    <Select<SearchResult>
      loadOptions={loadOptions}
      placeholder="Search..."
      getOptionLabel={(option) => option.prefLabel}
      getOptionValue={(option) => option.identifier}
    />
  );
}
