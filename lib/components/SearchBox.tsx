"use client";

import { SearchEngineType } from "@/lib/search/SearchEngineType";
import { createSearchEngineFromJson } from "@/lib/search/createSearchEngineFromJson";
import { Select } from "@/lib/components/Select";
import { useCallback, useMemo } from "react";
import { SearchResult } from "@/lib/search/SearchResult";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { SingleValue } from "react-select";
import { useRouter } from "next/navigation";
import { PageHrefs } from "@/app/PageHrefs";
import { stringToIdentifier } from "@/lib/utilities/stringToIdentifier";

export function SearchBox({
  languageTag,
  searchEngineJson,
}: {
  languageTag: LanguageTag;
  searchEngineJson: { [index: string]: any; type: SearchEngineType };
}) {
  const router = useRouter();
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
      isClearable
      loadOptions={loadOptions}
      placeholder="Search..."
      getOptionLabel={(option) => option.prefLabel}
      getOptionValue={(option) => option.identifier}
      noOptionsMessage={({ inputValue }) => inputValue}
      onChange={(selectedOption: SingleValue<SearchResult>) => {
        if (selectedOption === null) {
          return;
        }
        switch (selectedOption.type) {
          case "Concept":
            router.push(
              PageHrefs.concept({
                conceptIdentifier: stringToIdentifier(
                  selectedOption.identifier,
                ),
                languageTag,
              }),
            );
            break;
          case "ConceptScheme":
            router.push(
              PageHrefs.conceptScheme({
                conceptSchemeIdentifier: stringToIdentifier(
                  selectedOption.identifier,
                ),
                languageTag,
              }),
            );
            break;
        }
      }}
    />
  );
}
