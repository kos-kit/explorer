"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { PageTitleHeading } from "./PageTitleHeading";
import { Link } from "@/lib/components/Link";
import { Pagination } from "./Pagination";
import {
  SearchEngineJson,
  SearchResult,
  SearchResults,
  createSearchEngineFromJson,
} from "@kos-kit/client/search";
import { stringToIdentifier } from "@kos-kit/client/utilities";
import { LanguageTag } from "@kos-kit/client/models";
import { Hrefs } from "../Hrefs";
import { Configuration } from "../models/Configuration";

function AnimatedSpinner() {
  return (
    <svg
      className="animate-spin -ml-1 mr-3 h-16 w-16 text-black"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

function searchResultHref({
  configuration,
  languageTag,
  searchResult,
}: {
  configuration: Configuration;
  languageTag: LanguageTag;
  searchResult: SearchResult;
}): string {
  const hrefs = new Hrefs({ configuration, languageTag });

  switch (searchResult.type) {
    case "Concept":
      return hrefs.concept({
        identifier: stringToIdentifier(searchResult.identifier),
      });
    case "ConceptScheme":
      return hrefs.conceptScheme({
        identifier: stringToIdentifier(searchResult.identifier),
      });
  }
}

interface SearchPageProps {
  configuration: Configuration;
  languageTag: LanguageTag;
  searchEngineJson: SearchEngineJson;
}

function SearchPageImpl({
  configuration,
  languageTag,
  searchEngineJson,
}: SearchPageProps) {
  const hrefs = new Hrefs({ configuration, languageTag });
  const resultsPerPage = configuration.conceptsPerPage;
  const searchParams = useSearchParams();
  const pageString = searchParams!.get("page");
  let page = pageString ? parseInt(pageString) : 0;
  if (isNaN(page)) {
    page = 0;
  }
  const query = searchParams!.get("query");

  const [error, setError] = useState<Error | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(
    null,
  );

  useEffect(() => {
    if (!query) {
      setError(new Error("Invalid query"));
      return;
    }

    const searchEngine = createSearchEngineFromJson(searchEngineJson);

    searchEngine
      .search({
        languageTag,
        limit: resultsPerPage,
        offset: page * resultsPerPage,
        query,
      })
      .then(setSearchResults, setError);
  }, [
    languageTag,
    page,
    query,
    resultsPerPage,
    searchEngineJson,
    searchParams,
  ]);

  if (error) {
    return (
      <>
        <PageTitleHeading>Error</PageTitleHeading>
        <p>{error.message}</p>
      </>
    );
  }

  const heading = (
    <PageTitleHeading>Search results for &quot;{query}&quot;</PageTitleHeading>
  );
  if (searchResults === null) {
    return (
      <>
        {heading}
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <h2 className="font-normal text-lg text-center">Loading...</h2>
            <AnimatedSpinner />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {heading}
      <ul>
        {searchResults.page.map((searchResult, searchResultI) => (
          <li key={searchResultI}>
            {searchResult.type}:&nbsp;
            <Link
              href={searchResultHref({
                configuration,
                languageTag,
                searchResult,
              })}
            >
              <b>{searchResult.prefLabel}</b>
            </Link>
          </li>
        ))}
      </ul>
      <Pagination
        currentPage={page}
        itemsPerPage={resultsPerPage}
        itemsTotal={searchResults.total}
        pageHref={(page) =>
          hrefs.search({
            page,
            query: query ?? undefined,
          })
        }
      />
    </>
  );
}

export function SearchPage(props: SearchPageProps) {
  // https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
  return (
    <Suspense>
      <SearchPageImpl {...props} />
    </Suspense>
  );
}
